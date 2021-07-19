const path = require("path");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

// App setup
const config = require('./server.config.json');
const app = express();
const server = require("http").createServer(app);

// Static files
app.use(express.static("public"));
app.use(cors());

// socket setup
const io = socket(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  }
});

// store connected clients in an array
const connectedClients = [];
const connectedPresenters = [];
const disconnectedClients = [];

app.get("/", function (req, res) {
  res.sendFile(path.resolve("./public/clients.html"));
});

// Whenever someone connects this gets executed
io.on("connection", (socket) => {

  // this if determines if the connected socket is a presenter
  if (socket.handshake.query["my-secret"] === "I am the dictator!") {
    const presenter = socket;

    presenter.on("reset", () => {

      connectedClients.forEach(element => {
        element.finished = "reset";
        element.help = "reset";
      });

      io.emit("resetStatus", connectedClients);
    });

    console.log(connectedClients);
    presenter.emit("submitClients", connectedClients); 
    connectedPresenters.push(presenter);

  } else {

    socket.on("submitClients", submitClients);

    socket.on("status", (data) => {

      connectedClients.forEach(element => {
        if(element.id === socket.id) {
          element.finished = data.finished; 
          element.help = data.help;    
        }
      });
    
      for (let i = 0; i < connectedPresenters.length; i++) {
        const presenter = connectedPresenters[i];
        presenter.emit("clientStatus", connectedClients);
      }
    });

    socket.on("disconnect", clientDisconnect)

    connectedClients.push({
      id: socket.id,
      name: "Unnamed user",
    });
  }

  // socket.on("submitPresenters", (data) => {
  //   for (let i = 0; i < connectedPresenters.length; i++) {
  //     if(connectedPresenters[i].id === socket.id) connectedPresenters[i].name = data.name;
  //   }
  //   console.log(connectedPresenters);
  // });

});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  console.log(`http://localhost:${config.port}`);
});

/**
 * Handler for the 'submitClients' websocket event. Submits updated list of clients to all presenters
 * @param {object} data 
 */
function submitClients(data) {
  for (let i = 0; i < connectedClients.length; i++) {
    if(connectedClients[i].id === this.id) connectedClients[i].name = data.name;
  }
  console.log(connectedClients);

  for (let i = 0; i < connectedPresenters.length; i++) {
    const presenter = connectedPresenters[i];
    presenter.emit("submitClients", connectedClients);
  }
}

/**
 * Handler for the 'disconnect' websocket event. Deletes a disconnected client from array connectedClients
 */
function clientDisconnect() {
  console.log("disconnect");
  
  for (let i = 0; i < connectedClients.length; i++) {
    const client = connectedClients[i];
    // console.log(client.id + "just disconnected");
  
    if(client.id === this.id) {
      connectedClients.splice(i, 1);
      disconnectedClients.push(client);
    }
  }

  connectedPresenters.forEach(presenter => {
    console.log("presenter gets ", connectedClients);
    presenter.emit("clientDisconnect", connectedClients, disconnectedClients);
  });
}
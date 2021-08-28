const path = require("path");
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const debug = require('debug')('app:startup');

// App setup
const config = require('./server.config.json');
const app = express();
const server = require("http").createServer(app);

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

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
let connectedClients = [];
const connectedPresenters = [];
// const disconnectedClients = [];

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
        element.disconnect = "reset";
      });

      io.emit("resetStatus", connectedClients);
    });

    presenter.emit("clientHasConnected", connectedClients)

    presenter.emit("submitClients", connectedClients);
    connectedPresenters.push(presenter);

    presenter.on("removedClients", (listOfClients) => {
      connectedClients = listOfClients;
      presenter.emit("newClientList", connectedClients)
    });

  } else {

    socket.on("submitClients", submitClients);

    socket.on("status", (data) => {

      connectedClients.forEach(element => {
        if (element.id === socket.id) {
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
    if (connectedClients[i].id === this.id) connectedClients[i].name = data.name;
  }
  debug("List of connected clients: ", connectedClients);

  for (let i = 0; i < connectedPresenters.length; i++) {
    const presenter = connectedPresenters[i];
    presenter.emit("submitClients", connectedClients);
  }
}

/**
 * Handler for the 'disconnect' websocket event. Deletes a disconnected client from array connectedClients
 */
function clientDisconnect() {
  debug("A client has disconnected");

  for (let i = 0; i < connectedClients.length; i++) {
    const client = connectedClients[i];

    if (client.id === this.id) {
      debug(client.name + " just disconnected!");
      client.disconnect = true;
    }
  }

  connectedPresenters.forEach(presenter => {
    debug("Updated list of connected clients sent to Presenters: ", connectedClients);
    presenter.emit("clientDisconnect", connectedClients);
  });
}
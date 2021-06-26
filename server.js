const path = require("path");
const express = require("express");
const socket = require("socket.io");

// App setup
const config = require('./server.config.json');
const app = express();
const server = require("http").createServer(app);

let presenter;

// Static files
app.use(express.static("public"));

// socket setup
const io = socket(server);

// store connected clients in an array
const connectedClients = [];
const connectedPresenters = [];

app.get("/", function (req, res) {
  res.sendFile(path.resolve("./public/clients.html"));
});

// Whenever someone connects this gets executed
io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  if (socket.handshake.query["my-secret"] === "I am the dictator!") {
    presenter = socket;

    presenter.on("reset", () => {
      io.emit("reset");
    });

    connectedPresenters.push({
      id: socket.id,
      name: "",
    })
  } else {
    connectedClients.push({
      id: socket.id,
      name: "",
    });
  }

  socket.on("submitClients", (data) => {

    for (let i = 0; i < connectedClients.length; i++) {
      if(connectedClients[i].id === socket.id) connectedClients[i].name = data.name;
    }
  });

  socket.on("submitPresenters", (data) => {
    for (let i = 0; i < connectedPresenters.length; i++) {
      if(connectedPresenters[i].id === socket.id) connectedPresenters[i].name = data.name;
    }
  })

  if(presenter) presenter.emit("submitClients", connectedClients) 
  console.log(connectedClients);

  socket.on("status", (data) => {
    if(presenter) presenter.emit("status", data);
  });

});

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  console.log(`http://localhost:${config.port}`);
});

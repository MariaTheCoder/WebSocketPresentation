const path = require("path");
const express = require("express");
const socket = require("socket.io");

// App setup
const port = 3000;
const app = express();
const server = require("http").createServer(app);

let presenter;

// Static files
app.use(express.static("public"));

// socket setup
const io = socket(server);

app.get("/", function (req, res) {
  res.sendFile(path.resolve("./public/clients.html"));
});

// Whenever someone connects this gets executed
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  if (socket.handshake.query["my-secret"] === "I am the dictator!") {
    presenter = socket;

    presenter.on("reset", () => {
      io.emit("reset");
    });

    socket.on("status", (data) => {
      presenter.emit("completion", data);
    });
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

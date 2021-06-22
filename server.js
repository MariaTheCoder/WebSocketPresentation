const express = require("express");
const socket = require("socket.io");

// App setup
const port = 3000;
const app = express();
const server = require("http").createServer(app);

// Static files
app.use(express.static("public"));

// socket setup
const io = socket(server);

app.get("/", function (req, res) {
  res.sendFile("C:/Users/Bruger/code/june_project/public/clients.html");
});

// Whenever someone connects this gets executed
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("completion", (data) => {
    io.sockets.emit("completion", data);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

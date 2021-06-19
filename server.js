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
  res.sendFile("index.html");
});

const activeUsers = new Set();

// // Whenever someone connects this gets executed
// io.on("connection", function (socket) {
//   console.log("A user connected");

//   socket.on("new user", function (data) {
//     socket.userId = data;
//     activeUsers.add(data);
//     io.emit("new user", [...activeUsers]);
//   });

//   //Whenever someone disconnects this piece of code gets executed
//   socket.on("disconnect", () => {
//     activeUsers.delete(socket.userId);
//     io.emit("user disconnected", socket.userId);
//   });
// });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

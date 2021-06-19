const express = require("express");
const app = express();
const server = require("http").createServer(app);

app.get("/", function (req, res) {
  res.send("Hello World");
});

server.listen(3000, () => {
  console.log("Server listening on Port 3000...");
});

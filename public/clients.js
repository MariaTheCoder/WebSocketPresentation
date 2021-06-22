// Make socket connection back-end
const socket = io();

const activeUsers = document.getElementById("active_users");

// Emit events
document.getElementById("green_btn").addEventListener("click", () => {
  socket.emit("status", {
    id: socket.id,
    finished: true,
    help: false,
  });
});

// Emit events
document.getElementById("red_btn").addEventListener("click", () => {
  socket.emit("status", {
    id: socket.id,
    finished: false,
    help: true,
  });
});

socket.on("reset", () => {
  console.log("The Dictator has resetted everything!");
});

// Make socket connection back-end
const socket = io();

const activeUsers = document.getElementById("active_users");

document.getElementById("submit_btn").addEventListener("click", () => {

  const user = {
    id: socket.id,
    name: document.getElementById("name_input").value,
  }
  console.log(user);
});

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

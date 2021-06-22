// Make socket connection back-end
const socket = io();

const connectedClients = document.getElementById("active_users");

document.getElementById("submit_btn").addEventListener("click", () => {
  const submittedName = document.getElementById("name_input").value;
  connectedClients.innerHTML = "";

  // change text of button upon submitted name
  document.getElementById("submit_btn").innerText = 'Change name';

  socket.emit("submit", {
    id: socket.id,
    name: submittedName,
  });
  
  const newUser = document.createElement("li");
  newUser.innerHTML = submittedName;
  connectedClients.appendChild(newUser);
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

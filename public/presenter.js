
// Make socket connection back-end
const socket = io({
  query: {
    "my-secret": "I am the dictator!",
  },
});

const listOfConnectedUsers = document.getElementById("connected_users");

socket.on("submit", (data) => {
  const newUser = document.createElement("li");
  newUser.innerHTML = data.name;
  listOfConnectedUsers.appendChild(newUser);
});

socket.on("status", (data) => {
  console.log("status", data);
});

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});

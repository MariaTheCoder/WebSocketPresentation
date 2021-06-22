
// Make socket connection back-end
const socket = io({
  query: {
    "my-secret": "I am the dictator!",
  },
});

socket.on("submit", (data) => {
  console.log("submit", data);
});

socket.on("status", (data) => {
  console.log("status", data);
});

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});


// Make socket connection back-end
const socket = io({
  query: {
    "my-secret": "I am the dictator!",
  },
});

socket.on("completion", (data) => {
  console.log("completion", data);
});

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});

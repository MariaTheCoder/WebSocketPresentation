// Make socket connection back-end
const socket = io("http://localhost:3000/", {
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

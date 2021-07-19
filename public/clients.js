// Make socket connection back-end
const socket = io("http://localhost:3000");

const displayClient = document.getElementById("displayConnectedUser");

document.getElementById("submit_btn").addEventListener("click", () => {
  displayClient.innerHTML = "";

  if(document.getElementById("name_input").value === "") alert("Please type in a name before submitting");

  const name = document.getElementById("name_input").value;

  if(document.getElementById("submit_btn").innerText === 'Submit') {    
    // change text of button upon submitted name
    document.getElementById("submit_btn").innerText = 'Change name';
  };

  socket.emit("submitClients", {
    id: socket.id,
    name: name,
  });

  const connectedClient = document.createElement("li");
  connectedClient.innerHTML = "You are connected as: " + name;
  displayClient.appendChild(connectedClient);
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
  document.getElementById("red_btn").style.display = "none";
  document.getElementById("orange_btn").style.display = "inline-flex";

  socket.emit("status", {
    id: socket.id,
    finished: false,
    help: true,
  });
});

// Emit events
document.getElementById("orange_btn").addEventListener("click", () => {
  document.getElementById("red_btn").style.display = "inline-flex";
  document.getElementById("orange_btn").style.display = "none";

  socket.emit("status", {
    id: socket.id,
    finished: true,
    help: false,
  });
})

socket.on("resetStatus", () => {
  console.log("The Dictator has resetted everything!");
});

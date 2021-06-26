// Make socket connection back-end
const socket = io();

const displayClient = document.getElementById("displayConnectedUser");

document.getElementById("submit_btn").addEventListener("click", () => {
  displayClient.innerHTML = "";
  const name = document.getElementById("name_input").value;

  if(document.getElementById("submit_btn").innerText === 'Submit') {    
    // change text of button upon submitted name
    document.getElementById("submit_btn").innerText = 'Change name';
  };

  socket.emit("submitClients", {
    id: socket.id,
    name: name,
  });

  const newUser = document.createElement("li");
  newUser.innerHTML = "You are connected as: " + name;
  displayClient.appendChild(newUser);
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

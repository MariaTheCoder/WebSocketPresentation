
// Make socket connection back-end
const socket = io({
  query: {
    "my-secret": "I am the dictator!",
  },
});

const listOfConnectedClients = document.getElementById("connected_clients");
// const displayPresenter = document.getElementById("displayConnectedPresenter");

// // We also want to list connected presenters
// // For this, we need an input text field, a button to submit name of presenter and a place to list connected presenters 
// const listOfConnectedPresenters = document.getElementById("connected_presenters");
// const submit_btn = document.getElementById("submit_name");

// submit_btn.addEventListener("click", () => {
//   submit_btn.disabled = true;

//   // get input name and store in constant variable
//   const name = document.getElementById("presenter_name").value;

  // socket.emit("submitPresenters", {
  //   id: socket.id,
  //   name: name,
  // });

//   const presenter = document.createElement("li");
//   presenter.innerHTML = "You are connected as: " + name;
//   displayPresenter.appendChild(presenter);
// });

socket.on("disconnect", (data) => {

  for (let i = 0; i < data.length; i++) {
    const disconnectedClient = data[i];
    
    if(disconnectedClient.id === socket.id) listOfConnectedClients.removeChild(listOfConnectedClients.childNodes[i]);
  }
})

socket.on("submitClients", (data) => {

  listOfConnectedClients.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const client = document.createElement("li");

    client.innerHTML = data[i].name ? data[i].name : "Unnamed user.";
    listOfConnectedClients.appendChild(client);
    console.log('Connected client: ' + data[i].name);
  }
});

// socket.on("submitPresenters", (data) => {
  
//   for (let i = 0; i < data.length; i++) {
//     const presenter = document.createElement("li");
//     presenter.innerHTML = data[i].name;
//     listOfConnectedPresenters.appendChild(presenter);
//     console.log('Connected presenter: ' + data[i].name);
//   }
// });

socket.on("status", (data) => {
  console.log("status", data);
});

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});

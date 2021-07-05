
// Make socket connection back-end
const socket = io({
  query: {
    "my-secret": "I am the dictator!",
  },
});

const listOfConnectedClients = document.getElementById("connected_clients");
const listOfClientStatus = document.getElementById("client_status");
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

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});

socket.on("clientStatus", (data) => {
  console.log(data);
  listOfClientStatus.innerHTML = "";
  
  for (let i = 0; i < data.length; i++) {
    const statusUpdate = document.createElement("li");

    if(data[i].help === true) {
      statusUpdate.innerHTML = data[i].name + '<p>&nbsp;needs help</p>'
      listOfClientStatus.appendChild(statusUpdate);
    } else if(data[i].help === false) {
      statusUpdate.innerHTML = data[i].name + '<p>&nbsp;finished the task successfully</p>'
      listOfClientStatus.appendChild(statusUpdate);
    } else {
      statusUpdate.innerHTML = data[i].name + '<p>&nbsp;has not updated their status yet</p>'
      listOfClientStatus.appendChild(statusUpdate);
    }
  }
})

socket.on("clientDisconnect", (connectedClients, disconnectedClients) => {
  listOfConnectedClients.innerHTML = "";
  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < connectedClients.length; i++) {

    const client = document.createElement("li");

    client.innerHTML = connectedClients[i].name ? connectedClients[i].name : "Unnamed user";
    listOfConnectedClients.appendChild(client);


    const currentStatus = document.createElement("li");

    if(connectedClients[i].help === true) {
      currentStatus.innerHTML = connectedClients[i].name + '<p>&nbsp;needs help</p>';
      listOfClientStatus.appendChild(currentStatus);
    } else if(connectedClients[i].help === false) {
      currentStatus.innerHTML = connectedClients[i].name + '<p>&nbsp;finished the task successfully</p>';
      listOfClientStatus.appendChild(currentStatus);
    } else {
      currentStatus.innerHTML = connectedClients[i].name + '<p>&nbsp;has not updated their status yet</p>';
      listOfClientStatus.appendChild(currentStatus);
    }

  };

  console.log("A client has disconnected! Here you get two new arrays. First a new array of connected clients:");
  console.log(connectedClients);
  console.log("And here an array of disconnected clients:");
  console.log(disconnectedClients);
})


socket.on("submitClients", (data) => {

  listOfConnectedClients.innerHTML = "";
  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const client = document.createElement("li");

    client.innerHTML = data[i].name ? data[i].name : "Unnamed user";
    listOfConnectedClients.appendChild(client);
    console.log('Connected client: ' + data[i].name);

    const defaultStatus = document.createElement("li");
    defaultStatus.innerHTML = data[i].name + '<p>&nbsp;has not updated their status yet</p>';
    listOfClientStatus.appendChild(defaultStatus);
  }
});

socket.on("resetStatus", (data) => {
  console.log("You successfully reset! Here is an updated array of connected clients")
  console.log(data);

  listOfClientStatus.innerHTML = "";

  data.forEach(element => {
    const resetClientStatus = document.createElement("li");

    resetClientStatus.innerHTML = element.name + '<p>&nbsp;has not updated their status yet</p>'; 
    listOfClientStatus.appendChild(resetClientStatus);
  });
});

// socket.on("submitPresenters", (data) => {
  
//   for (let i = 0; i < data.length; i++) {
//     const presenter = document.createElement("li");
//     presenter.innerHTML = data[i].name;
//     listOfConnectedPresenters.appendChild(presenter);
//     console.log('Connected presenter: ' + data[i].name);
//   }
// });





// Make socket connection back-end
const socket = io("http://localhost:3000", {
  query: {
    "my-secret": "I am the dictator!",
  },
});

const listOfClientStatus = document.getElementById("client_status");

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("reset");
});

socket.on("clientHasConnected", defaultClientStatus);

socket.on("clientStatus", updateClientStatus);

socket.on("clientDisconnect", updateClientStatus);

socket.on("submitClients", updateClientStatus);

socket.on("resetStatus", (data) => {
  console.log("You successfully reset! Here is an updated array of connected clients")
  console.log(data);

  listOfClientStatus.innerHTML = "";

  data.forEach(element => {
    const resetClientStatus = document.createElement("li");

    resetClientStatus.innerHTML = `${element.name} has not updated their status yet</p>`;
    listOfClientStatus.appendChild(resetClientStatus);
  });
});

socket.on("newClientList", (updatedClientList) => {
  updateClientStatus(updatedClientList);
});

function defaultClientStatus(connectedClients) {
  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < connectedClients.length; i++) {
    const client = document.createElement("li");

    client.innerHTML = connectedClients[i].name ? connectedClients[i].name : "Unnamed user";

    const defaultStatus = document.createElement("li");
    defaultStatus.innerHTML = `<p>${connectedClients[i].name} has not updated their status yet</p>`;
    listOfClientStatus.appendChild(defaultStatus);
  }
}

function updateClientStatus(data) {
  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const statusUpdate = document.createElement("li");

    if (data[i].disconnect === true) {
      removeClientFromList(data);

      const icon = document.createElement("i");
      icon.classList.add("icon-cancel-circled");
      statusUpdate.appendChild(icon);

      const text = document.createElement("p");
      text.innerText = ` ${data[i].name} has disconnected`;
      statusUpdate.appendChild(text);

      listOfClientStatus.appendChild(statusUpdate);
    } else if (data[i].help === true) {
      const icon = document.createElement("i");
      icon.classList.add("icon-attention");
      statusUpdate.appendChild(icon);

      const text = document.createElement("p");
      text.innerText = ` ${data[i].name} needs help`;
      statusUpdate.appendChild(text);

      listOfClientStatus.appendChild(statusUpdate);
    } else if (data[i].help === false) {
      const icon = document.createElement("i");
      icon.classList.add("icon-ok-circled");
      statusUpdate.appendChild(icon);

      const text = document.createElement("p");
      text.innerText = ` ${data[i].name} finished the task successfully`;
      statusUpdate.appendChild(text);

      listOfClientStatus.appendChild(statusUpdate);
    } else {
      const text = document.createElement("p");
      text.innerText = ` ${data[i].name} has not updated their status yet`;
      statusUpdate.appendChild(text);

      listOfClientStatus.appendChild(statusUpdate);
    }
  }
}

function removeClientFromList(list) {
  for (let i = 0; i < list.length; i++) {
    const client = list[i];

    if (client.disconnect === true) {
      setTimeout(() => {
        list.splice(i, 1);
        updateClientStatus(list);
        socket.emit('removedClients', list);
      }, 2000);
    }
  }
}



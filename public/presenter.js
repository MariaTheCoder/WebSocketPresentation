
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

socket.on("clientStatus", updateClientStatus);

socket.on("clientDisconnect", updateClientStatus);

socket.on("submitClients", (data) => {

  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const client = document.createElement("li");

    client.innerHTML = data[i].name ? data[i].name : "Unnamed user";

    const defaultStatus = document.createElement("li");
    defaultStatus.innerHTML = `<p>${data[i].name} has not updated their status yet</p>`;
    listOfClientStatus.appendChild(defaultStatus);
  }
});

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

function updateClientStatus(data) {
  listOfClientStatus.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const statusUpdate = document.createElement("li");

    if (data[i].disconnect === true) {
      removeClientFromList(data);
      statusUpdate.innerHTML = `<i class="icon-cancel-circled"></i><p style="text-decoration: line-through">&nbsp;${data[i].name} has disconnected</p>`
      listOfClientStatus.appendChild(statusUpdate);
    } else if (data[i].help === true) {
      statusUpdate.innerHTML = `<i class="icon-attention"></i><p>&nbsp;${data[i].name} needs help</p>`
      listOfClientStatus.appendChild(statusUpdate);
    } else if (data[i].help === false) {
      statusUpdate.innerHTML = `<i class="icon-ok-circled"></i><p>&nbsp;${data[i].name} finished the task successfully</p>`
      listOfClientStatus.appendChild(statusUpdate);
    } else {
      statusUpdate.innerHTML = `<p>&nbsp;${data[i].name} has not updated their status yet</p>`
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
      }, 2000 * 60);
    }
  }
}



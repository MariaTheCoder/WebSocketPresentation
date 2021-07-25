// Make socket connection back-end
const socket = io("http://localhost:3000");

/*
Input field, submit button and are of display for input assigned to constant variables 
*/
const displayClient = document.getElementById("displayConnectedUser");
const inputField = document.getElementById("name_input");
const submitButton = document.getElementById("submit_btn");

/*
Task related buttons assigned to constant variables
*/
const greenButton = document.getElementById("green_btn");
const redButton = document.getElementById("red_btn");
const orangeButton = document.getElementById("orange_btn");

/*
By feault, have green and red button disabled
*/
greenButton.disabled = true;
redButton.disabled = true;

/*
Upon click on submit button, enable the above disabled buttons
*/
submitButton.addEventListener("click", () => {

  // check if input field has been filled out upon click on submit button. If not, alert client
  if (inputField.value === "") {
    alert("Please type in a name before submitting");

  } else {

    // first enable task-buttons (a.k.a. green and red button)
    enableButtons();

    // clear display confirming submitted name
    displayClient.innerHTML = "";

    // save input in a constant variable
    const name = inputField.value;

    if (submitButton.innerText === 'Submit') {
      // change text of button upon submitted name
      submitButton.innerText = 'Change name';
    };

    socket.emit("submitClients", {
      id: socket.id,
      name: name,
    });

    const connectedClient = document.createElement("li");
    connectedClient.innerHTML = "You are connected as: " + name;
    displayClient.appendChild(connectedClient);
  }
});

// Emit events
greenButton.addEventListener("click", () => {
  socket.emit("status", {
    finished: true,
    help: false,
  });
});

// Emit events
redButton.addEventListener("click", () => {
  redButton.style.display = "none";
  orangeButton.style.display = "inline-flex";

  socket.emit("status", {
    finished: false,
    help: true,
  });
});

// Emit events
orangeButton.addEventListener("click", () => {
  redButton.style.display = "inline-flex";
  orangeButton.style.display = "none";

  socket.emit("status", {
    finished: "",
    help: "",
  });
})

socket.on("resetStatus", () => {
  console.log("The Dictator has resetted everything!");
  redButton.style.display = "inline-flex";
  orangeButton.style.display = "none";
});

function enableButtons() {
  greenButton.disabled = false;
  redButton.disabled = false;
}
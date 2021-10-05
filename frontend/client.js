//Establishing a connection with the server on port 3000
const socket = io('http://localhost:3000');

//heroku server
//const socket = io("https://serene-peak-32376.herokuapp.com/");

var chosenRoom;
var currentBackground;

socket.on("connect", () => {
  console.log('Connected to socket!')
});

// handle the event sent with socket.send()
socket.on("message", data => {
  console.log(data);
});

// handle the event sent with socket.emit()
socket.on("switchFromServer", (currentBackground, clientPressed) => {
  if(currentBackground === "darkgray"){
    document.body.style.backgroundColor = "hsl(203.6,15.9%,65.5%)";
    
  } else {
    document.body.style.backgroundColor = "darkgray";
  }
  console.log('Client who switched was: ' + clientPressed)
});

//Resets the background to white when a new user is connected
socket.on("resetToWhite", () =>{
  document.body.style.backgroundColor = "hsl(203.6,15.9%,65.5%)";
  console.log('New User has connected, resetting to white')

});

//Event listener on the button element: sends command to server to switch background when clicked
switchButton.addEventListener('click', () => {  
      //Grabs the current background
      currentBackground = document.body.style.backgroundColor
      //Tells the server to switch the background and sends which background to be 
      socket.emit('buttonPressed', chosenRoom, currentBackground);
})

//Event listener on the button element: takes the room number and connects the client to proper socket room
submitButton.addEventListener('click', () => { 
  //Grabbing the room value from input
  chosenRoom = document.getElementById('roomNum').value;
  //Checks whether the input has any value:
  if (chosenRoom === ""){
    console.log('No Room to join');
  } 
  else{
    //Sending room value to join that socket
    socket.emit('buttonSubmitted', chosenRoom);
    hideRoomValues();
  }
})

//Event listener on the button element: takes the room number and connects the client to proper socket room
logoutButton.addEventListener('click', () => { 
  console.log('Logging out of the room')
  socket.emit('logoutRoom', chosenRoom);
  backToMainScreen();
})

//Hides the room submission values when client joins a room
function hideRoomValues(){
  document.getElementById("submitButton").hidden = true;
  document.getElementById("roomLabel").hidden = true; 
  document.getElementById("roomNum").hidden = true;

  //Displays the Active Room number
  document.getElementById("activeRoom").hidden = false;
  document.getElementById("activeRoom").innerHTML = "Room Name: " + String(chosenRoom);

  //Reveals the switch button and the logout button
  document.getElementById("switchButton").hidden = false;
  document.getElementById("logoutButton").hidden = false;
}

function backToMainScreen(){
  //Reveals the room submission
  document.getElementById("submitButton").hidden = false;
  document.getElementById("roomLabel").hidden = false; 
  document.getElementById("roomNum").hidden = false;

  //Displays the Active Room number
  document.getElementById("activeRoom").hidden = true;
  document.getElementById("activeRoom").innerHTML = "Room Name: " + String(chosenRoom);

  //Reveals the switch button and the logout button
  document.getElementById("switchButton").hidden = true;
  document.getElementById("logoutButton").hidden = true;

  document.body.style.backgroundColor = "hsl(203.6,15.9%,65.5%)";
}
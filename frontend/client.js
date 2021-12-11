//Establishing a connection with the server on port 3000
// const socket = io('http://localhost:3000');

//heroku server
const socket = io("https://serene-peak-32376.herokuapp.com/");

var chosenRoom;
var currentBackground;
var isHost = false;

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
    document.body.style.backgroundColor = "hsl(214.3,7.4%,18.6%)";
    
  } else {
    document.body.style.backgroundColor = "black"; 
    // darkgrey
  }
  console.log('Client who switched was: ' + clientPressed)
});

//Resets the background to white when a new user is connected
socket.on("resetToWhite", data =>{
  document.body.style.backgroundColor = "black";
  console.log('New User has connected, resetting to white')
});

//Sets the card image to specified role
socket.on("receiveRole", role => {
  document.getElementById("roleCardContainer").style.display = "flex";
  console.log(`Received the role of: ${role}`);
  currentRole = role;
  document.getElementById("roleImage").src = `assets/${role}.png`;
});

socket.on("updateUserCount", newUserCount => {
  document.getElementById("countOfUsers").innerHTML= `Count of Users in Room: ${newUserCount}`;
});

socket.on("makeHost", () => {
  document.getElementById("switchButton").hidden = false;
  isHost = true;
});

//Event listener on the button element: sends command to server to switch background when clicked
switchButton.addEventListener('click', () => {  
      //Grabs the current background
      currentBackground = document.body.style.backgroundColor
      //Tells the server to switch the background and sends which background to be 
      socket.emit('buttonPressed', chosenRoom, currentBackground);
      socket.emit('gameStarted', chosenRoom)
})


//SUBMIT BUTTON
//Event listener on the button element: takes the room number and connects the client to proper socket room
submitButton.addEventListener('click', () => { 
  //Grabbing the room value from input
  chosenRoom = document.getElementById('roomNum').value;
  //Checks whether the input has any value:
  if (chosenRoom === ""){console.log('No Room to join');} 
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
  console.log(isHost)
  if (isHost){
    console.log('sending get new host')
    socket.emit('getNewHost', chosenRoom);
    isHost = false
  }
  backToMainScreen();
})

// Rotates the card if the user clicks on the card (made for Mobile use)
//Remove if you want it to only flip when the card is actively being touched 
// document.getElementById("roleCard").addEventListener("click", rotateRoleCard);
// function rotateRoleCard()
// {
//   const element = document.getElementById("roleCardInner")
  
//   if (element.classList.contains('cardRotation'))
//   {
//     element.classList.remove('cardRotation')
//     element.classList.add('resetCardRotation')
//   }
//   else{
//     element.classList.remove('resetCardRotation')
//     element.classList.add('cardRotation')
//   }
// }

//Hides the room submission values when client joins a room
function hideRoomValues(){
  document.getElementById("submitButton").hidden = true;
  document.getElementById("roomLabel").hidden = true; 
  document.getElementById("roomNum").hidden = true;

  //Displays the Active Room number
  document.getElementById("activeRoom").hidden = false;
  document.getElementById("activeRoom").innerHTML = "Room Name: " + String(chosenRoom);

  //Reveals the logoutButton button and the logout button
  document.getElementById("logoutButton").hidden = false;
  document.getElementById("countOfUsers").hidden = false;

  //Reveals the role card container
  // document.getElementById("roleCardContainer").style.display = "flex";
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
  document.getElementById("countOfUsers").hidden = true;
  document.getElementById("roleCardContainer").style.display = "none";

  document.body.style.backgroundColor = "black";
}
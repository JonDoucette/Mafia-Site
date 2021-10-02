//Establishing a connection with the server on port 3000
//const socket = io('http://localhost:3000');
//const socket = io.connect();

//heroku server
//var url = ('https://serene-peak-32376.herokuapp.com/' + '3000' + '/index.html')

const socket = io("https://serene-peak-32376.herokuapp.com/");


//Grabbing the button element by the ID
var switchButton = document.getElementById('switchButton');

var chosenRoom;
var currentBackground;

socket.on("connect", () => {
  console.log('Connected to socket')
});

// handle the event sent with socket.send()
socket.on("message", data => {
  console.log(data);
});

// handle the event sent with socket.emit()
socket.on("switchFromServer", (currentBackground) => {
  console.log('Switch from Server')
  if(currentBackground === "darkgray"){
    document.body.style.backgroundColor = "white";
} else {
    document.body.style.backgroundColor = "darkgray";
}
});

//Resets the background to white when a new user is connected
socket.on("resetToWhite", () =>{
  document.body.style.backgroundColor = "white";

  //
  hideRoomValues()



  console.log('New User has connected, resetting to white')

});

//Event listener on the button element: sends a message to the server when clicked
switchButton.addEventListener('click', () => {  
    //Sends message function to server.js
    //socket.emit('message', "Hello to the client who clicked this!");    
    

      //Grabs the current background
      currentBackground = document.body.style.backgroundColor
      //Tells the server to switch the background and sends which background to be 
      socket.emit('buttonPressed', chosenRoom, currentBackground);
})

//Event listener on the button element: sends a message to the server when clicked
submitButton.addEventListener('click', () => { 
  //Grabbing the room value
  chosenRoom = document.getElementById('roomNum').value
  console.log(chosenRoom)
  if (chosenRoom === ""){
    console.log('No Room to join');
  }
  else{
    //Sending room value to join that socket
    socket.emit('buttonSubmitted', chosenRoom);
  }


})

function hideRoomValues(){
  console.log('Hiding the Room Values')
  document.getElementById("submitButton").style.display = "none";
  document.getElementById("roomLabel").style.display = "none"; 
  document.getElementById("roomNum").style.display = "none";

  //Displays the Active Room number
  document.getElementById("activeRoom").style.display="block";
  document.getElementById("activeRoom").innerHTML = "Room Name: " + String(chosenRoom);
}
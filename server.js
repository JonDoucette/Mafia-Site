//Server Setup
const express = require('express');
const app = express();

//Allow for CORS to get in
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const http = require('http');
const server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

//Send over the frontend information to the client side.
var htmlPath = path.join(__dirname, 'frontend');
app.use(express.static(htmlPath)) 

app.get('/', (req, res) => {
  res.sendFile('/frontend/', {root: __dirname });

});

//Socket commands from client
var roomLocation = {};
io.on("connection", socket => {

  //If error connecting to client, reports error to Server
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  //Function to join the Submitted Room
  socket.on("buttonSubmitted", data => {

    console.log(socket.id + ' is joining socket: ' + data);
    socket.join(data);

    //Adds clientId to room location (which room they are connected in) dictionary
    roomLocation[String(socket.id)] = data

    //socket.broadcast.to(roles[0]).emit('message', 'Message to you as a client')
    //console.log(io.sockets.sockets.get(clientId));

    io.to(data).emit('resetToWhite');
    
  });

  //Switches the background when the button is pressed
  socket.on("buttonPressed", (chosenRoom, currentBackground) =>  {
    io.to(chosenRoom).emit('switchFromServer', currentBackground, socket.id);
  });

  //On disconnect, removes client from active rooms list
  socket.on('disconnect', function () {
    //Removes the user from record of active connected rooms
    console.log(socket.id + ' has disconnected from socket: ' + roomLocation[socket.id]);
    delete roomLocation[socket.id]

  })

});


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

/*
  Count the number of users in a specific room

    //Room Counter
    var countInRoom = 0
    var activeRoom = '1'
    //Count number in room (testing)
    for (let room in roomLocation) {
      if (roomLocation[room] === activeRoom){
        countInRoom += 1
      }
      
    }
    console.log(countInRoom)

*/
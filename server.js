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


//app.use(cors())
//app.options('*', cors())



app.get('/', (req, res) => {
  res.sendFile('/frontend/', {root: __dirname });

});

var roomLocation = {};

io.on("connection", socket => {
  // either with send()
  socket.send("Howdy from the socket");

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  //Function to join the Submitted Room
  socket.on("buttonSubmitted", data => {
    console.log("Submit Button was pressed");
    socket.leave();


    console.log('Joining socket: ' + data);
    socket.join(data);

    //Adds clientId to room location (which room they are connected in) dictionary
    roomLocation[String(socket.id)] = data
    console.log(roomLocation)

    //map = io.sockets.adapter.rooms
    //console.log(map.get(data))

    //Get client ids from clients connected to Room 1 to array 
    //roles = [...map.get('1').values()]
    //console.log(roles)
    //Connected users
    //console.log(roles.length)
    //console.log(map.values())
    //console.log(io.sockets.adapter.rooms)

    //console.log(roles[0])
    //socket.broadcast.to(roles[0]).emit('message', 'Message to you as a client')
    //console.log(io.sockets.sockets.get(clientId));


    io.to(data).emit('resetToWhite');
    
  });


  socket.on("buttonPressed", (chosenRoom, currentBackground) =>  {
    console.log('Clicked the switch button')
    io.to(chosenRoom).emit('switchFromServer', currentBackground);
    

  });

  socket.on('disconnect', function () {
    //Removes the user from record of active connected rooms
    delete roomLocation[socket.id]
    console.log(roomLocation)
    console.log(socket.id + 'has disconnected');

    var countInRoom = 0
    var activeRoom = '1'
    //Count number in room (testing)
    for (let room in roomLocation) {
      if (roomLocation[room] === activeRoom){
        countInRoom += 1
      }
      
    }
    console.log(countInRoom)
  })



});



server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
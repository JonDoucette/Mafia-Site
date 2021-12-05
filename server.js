const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())


app.get('/', (req, res) => {
  res.sendFile('/frontend/', {root: __dirname });

});

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ['Access-Control-Allow-Private-Network: true', 'Access-Control-Allow-Origin: *'],

  },
})

var path = require('path');
const { count } = require('console');
//Send over the frontend information to the client side.
var htmlPath = path.join(__dirname, 'frontend');
app.use(express.static(htmlPath)) 


//Socket commands from client
var roomLocation = {};
var currentGameRoles = {};
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

    var countInRoom = 0
    var activeRoom = data
    //Count number in room (testing)
    for (let room in roomLocation) {
      if (roomLocation[room] === activeRoom){
        countInRoom += 1
      } 
    }

    io.to(data).emit('resetToWhite');
    io.to(data).emit('updateUserCount', countInRoom);
    if (countInRoom === 1){
      io.to(data).emit('makeHost');
    }
    //If the user is already a part of the running game, give role
    if (activeRoom in currentGameRoles){
      if (Object.keys(currentGameRoles[activeRoom]).includes(socket.id)){
        var existingRole = currentGameRoles[activeRoom][socket.id]
        io.to(String(socket.id)).emit('receiveRole', existingRole)
      }
    }
  });

  //Switches the background when the button is pressed
  socket.on("buttonPressed", (chosenRoom, currentBackground) =>  {

    countInRoom = getRoomCount(chosenRoom)

    if (countInRoom < 3) {console.log('Nope')}
    console.log(countInRoom)
    io.to(chosenRoom).emit('switchFromServer', currentBackground, socket.id);
    console.log(roomLocation)
  });

  //On disconnect, removes client from active rooms list
  socket.on('disconnect', function () {
    //Removes the user from record of active connected rooms
    console.log(socket.id + ' has disconnected from socket: ' + roomLocation[socket.id]);
    var room = roomLocation[socket.id]
    delete roomLocation[socket.id]
    
    var newUserCount = getRoomCount(room)
    //Update count of users in room
    io.to(room).emit('updateUserCount', newUserCount)
    

    console.log('Updating the host')
    getNewHostOnDisconnect(socket.id,room);
  })

  socket.on('logoutRoom', data => {
    console.log('Disconnecting user from the room ')
    //Leaves the socket and removes from logging
    socket.leave(roomLocation[socket.id])
    delete roomLocation[socket.id]

    var newUserCount = getRoomCount(data)
    //Update count of users in room
    io.to(data).emit('updateUserCount', newUserCount)
    
  })

  socket.on('gameStarted', (chosenRoom) => {
    console.log('Game has been started')
    countInRoom = getRoomCount(chosenRoom)
    if (countInRoom < 4) {console.log('Not enough players to start')}
    else{

    var roleList = getMafiaRoles(countInRoom)
    console.log('role List: ')
    console.log(roleList)

    var runningGameRoles = {}

    //Loops through each user in the room and sends Role
    var userList = getKeyByValue(roomLocation, chosenRoom)
    userList.forEach(function (user, index){
          
      console.log(user)
      var item = roleList[Math.floor(Math.random()*roleList.length)]
      var index = roleList.indexOf(item)
      roleList.splice(index, 1)
      console.log(item)
      runningGameRoles[user] = item;

      //Send result to specific user (by socket id) via "receiveRole"
      io.to(String(user)).emit('receiveRole', item)
        
    })

    currentGameRoles[chosenRoom] = runningGameRoles;
    console.log(currentGameRoles)
  }
    console.log(roomLocation)



    // {
    //   JLsMLxzXnLqxOMgjAAAL: '14',
    //   Pz3YHRvWbvc1RWpzAAAP: '14',
    //   _EPtt3XzvBbspn19AAAR: '15'
    // }


  })

  socket.on('getNewHost', (chosenRoom) => {
    console.log(`Making new host in room: ${chosenRoom}`)
    newHost = Object.keys(roomLocation)[0]
    io.to(String(newHost)).emit('makeHost')
  })

});


server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on *:${process.env.PORT || 3000}`);
});

function getRoomCount(roomId){
      //Room Counter
      var countInRoom = 0
      var activeRoom = roomId
      //Count number in room (testing)
      for (let room in roomLocation) {
        if (roomLocation[room] === activeRoom){
          countInRoom += 1
        }
        
      }
      return(countInRoom)
}

function getMafiaRoles(countOfUsers){

  //Bomber checkbox

  console.log('Getting Mafia Roles')
  switch(countOfUsers){
    case 4:
      return ['mafia', 'town', 'town', 'town']
    case 5:
      return ['mafia', 'investigator', 'medic', 'town', 'town']
    case 6:
      return ['mafia', 'investigator', 'medic', 'town', 'town', 'town']
    case 7:
      return ['mafia', 'mafia', 'investigator', 'medic', 'town', 'town', 'town']
    case 8:
      return ['mafia', 'mafia', 'mafia', 'investigator', 'medic', 'bomber', 'town', 'town']
    case 9:
      return ['mafia', 'mafia', 'mafia', 'investigator', 'medic', 'bomber', 'town', 'town', 'town']
    case 10:
      return ['mafia', 'mafia', 'mafia', 'investigator', 'medic', 'bomber', 'town', 'town', 'town', 'town']
    case 11:
      return ['mafia', 'mafia', 'mafia', 'mafia', 'investigator', 'medic', 'bomber', 'town', 'town', 'town', 'town']
    case 12:
      return ['mafia', 'mafia', 'mafia', 'mafia', 'investigator', 'medic', 'bomber', 'town', 'town', 'town', 'town', 'town']
    }
}
  
function getKeyByValue(object, value) {
  return Object.keys(object).filter(key => object[key] === value);
}

function getNewHostOnDisconnect(user, chosenRoom) {
    console.log(`Making new host in room: ${chosenRoom}`)
    var dictionaryLength = Object.keys(roomLocation).length
    for (let i = 0; i < dictionaryLength; i++) {
      newHost = Object.keys(roomLocation)[i]
      if (String(newHost) == String(user)) {continue}
      else{
        console.log('Making new host')
        io.to(String(newHost)).emit('makeHost');
        break;
      }
    }
}

const io = require('socket.io')(3000);

var roomCount = {}; 

io.on("connection", socket => {
  // either with send()
  socket.send("Howdy from the socket");


  socket.on("buttonSubmitted", data => {
    console.log("Submit Button was pressed");
    socket.leave();


    console.log('Joining socket: ' + data);
    socket.join(data);

    //Adds the running total number of users to the dictionary
    if (isNaN(roomCount[data])) {roomCount[data]=0};
    roomCount[data] = roomCount[data] + 1;
    console.log(roomCount);

    map = io.sockets.adapter.rooms
    console.log(map.get('1'))

    //Get client ids from clients connected to Room 1 to array 
    roles = [...map.get('1').values()]
    console.log(roles)
    //Connected users
    console.log(roles.length)
    //console.log(map.values())
    //console.log(io.sockets.adapter.rooms)

    console.log(roles[0])
    socket.broadcast.to(roles[0]).emit('message', 'Message to you as a client')
    //console.log(io.sockets.sockets.get(clientId));
    console.log()

    io.to(data).emit('resetToWhite');
    
  });


  socket.on("buttonPressed", (chosenRoom, currentBackground) =>  {
    console.log('Clicked the switch button')
    io.to(chosenRoom).emit('switchFromServer', currentBackground);
    

  });



});

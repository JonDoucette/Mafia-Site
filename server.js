const io = require('socket.io')(3000);


io.on("connection", socket => {
  // either with send()
  socket.send("Howdy from the socket");


  socket.on("buttonSubmitted", data => {
    console.log("Submit Button was pressed")
    socket.leave()

    console.log('Socket room should be:' + data)
    parseInt(data)
    console.log(data)
    socket.join(data)

    io.to(data).emit('resetToWhite')
  });


  socket.on("buttonPressed", (chosenRoom, currentBackground) =>  {
    console.log('Clicked the switch button')
    io.to(chosenRoom).emit('switchFromServer', currentBackground);

  });



});

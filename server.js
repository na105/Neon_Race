const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
  userJoin,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username}) => {
    const user = userJoin(socket.id, username);

    socket.join(user.room);


    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      users: getRoomUsers(user.room)
    });
  });


  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);


      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        users: getRoomUsers(user.room)
      });
    
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
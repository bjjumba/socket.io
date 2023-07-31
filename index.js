require('dotenv').config()
const express = require('express');
const socketio = require('socket.io');
const path = require('path');


const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = app.listen(process.env.PORT, () => {
    console.log('Server running!')
});

const io = socketio(server,
    {
        cors: {
          origin: "*",
          methods: ["GET", "POST","PUT","DELETE"]
          
        }
 
    })

let users = [];

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

  //sends the message to all the users on the server
  socket.on('message', (data) => {
    io.emit('messageResponse', data);
  });

  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
    socket.disconnect();
  });
})


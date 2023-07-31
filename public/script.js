const socket = io();

socket.emit('message', 'Hi');
var express = require('express');
var socketIO = require('ws');
var path = require('path');

var PORT = process.env.PORT || 3000;

var app = express();
var server =  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});
/*****************************************
  _   _
 | \ | | __ ___   ____ _ _ __ _ __ __ _
 |  \| |/ _` \ \ / / _` | '__| '__/ _` |
 | |\  | (_| |\ V / (_| | |  | | | (_| |
 |_| \_|\__,_| \_/ \__,_|_|  |_|  \__,_|
******************************************/

// Start Express
const express = require('express');
const path = require('path');
const app = express();
const onProduction = process.env.NODE_ENV === 'production'; // Accomodate process.env and eqeqeq eslint rule

const host = '0.0.0.0';
const port = process.env.PORT || 4000;

// Define express and socket port
const CONSTANTS = {
  port: {
    express: 4000,
    socket: onProduction ? 8443 : 9000,
  },
  root: {
    folder: onProduction ? '/dist' : '/'
  }
};

//Start Express and use the correct env.
app.use('/', express.static(path.join(__dirname, CONSTANTS.root.folder)))
const server = app.listen(port, host);
console.log(`ON PROD: ${onProduction} - Starting web on port ${port}`);
console.log(`PORT: ${CONSTANTS.port.socket}`);

// Actual game server
const Navarra = require('./server/Navarra');

// Create server for websocket to listen on
const server = http.createServer(app)
server.listen(CONSTANTS.port.socket)

// Initialize the Game class with port number
const game = new Navarra(server);

// Start the game server.
game.start();

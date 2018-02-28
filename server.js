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
require('dotenv').config();
const app = express();
const onProduction = process.env.PRODUCTION === 'true'; // Accomodate process.env and eqeqeq eslint rule

// Define express and socket port
const CONSTANTS = {
  port: {
    express: 4000,
    socket: onProduction ? 443 : 9000,
  },
  root: {
    folder: onProduction ? 'dist' : '/'
  }
};

console.log(CONSTANTS);

//Start Express and use the correct env.
app.use('/', express.static(path.join(__dirname, CONSTANTS.root.folder)))
const server = app.listen(CONSTANTS.port.express, '127.0.0.1');
console.log(`Starting web on port ${CONSTANTS.port.express}`);

// Actual game server
const Navarra = require('./server/Navarra');

// Initialize the Game class with port number
const game = new Navarra(CONSTANTS.port.socket);

// Start the game server.
game.start();

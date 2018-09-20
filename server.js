/** ***************************************
Navarra
a fun medieval 2d javascript rpg
https://navarra-rpg.com
***************************************** */

// Start Express
const path = require('path');
const http = require('http');
const compression = require('compression');
const express = require('express');

const app = express();
app.use(compression());
const port = process.env.PORT || 4000;

const onProduction = process.env.NODE_ENV === 'production'; // Accomodate process.env and eqeqeq eslint rule

// Define express and socket port
const CONSTANTS = {
  port: {
    express: 4000,
    socket: 4000,
  },
  root: {
    folder: onProduction ? '/dist' : '/',
  },
};

// Start Express and use the correct env.
app.use(express.static(path.join(__dirname, CONSTANTS.root.folder)));

// Actual game server
const Navarra = require('./server/Navarra');

// Create server for websocket to listen on
const server = http.createServer(app);
server.listen(port);

// Initialize the Game class with port number
const game = new Navarra(server);

// Start the game server.
game.start();

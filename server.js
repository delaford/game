/*****************************************
  _   _
 | \ | | __ ___   ____ _ _ __ _ __ __ _
 |  \| |/ _` \ \ / / _` | '__| '__/ _` |
 | |\  | (_| |\ V / (_| | |  | | | (_| |
 |_| \_|\__,_| \_/ \__,_|_|  |_|  \__,_|
******************************************/

// Start Express
const express = require('express');
require('dotenv').config();
const app = express();

//Start Express and use the correct env.
const port = process.env.PORT || 4000;
app.use('/', express.static(process.env.PRODUCTION ? 'dist' : '/'));
const server = app.listen(port, '127.0.0.1');

// Actual game server
const Navarra = require('./server/Navarra');

// Initialize the Game class with port number
const game = new Navarra(8443);

// Start the game server.
game.start();

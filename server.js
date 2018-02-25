/*****************************************
  _   _
 | \ | | __ ___   ____ _ _ __ _ __ __ _
 |  \| |/ _` \ \ / / _` | '__| '__/ _` |
 | |\  | (_| |\ V / (_| | |  | | | (_| |
 |_| \_|\__,_| \_/ \__,_|_|  |_|  \__,_|
******************************************/

// Start Express
const express = require('express');
const app = express();

//Start Express Router
const router = express.Router();
const port = process.env.PORT || 8080;

// Connect path to Express router
app.use("/", router);
app.use(express.static('static'))
var server = app.listen(port, function () {
  console.log('Node.js static server listening on port: ' + port)
});

// Actual game server
const Navarra = require('./server/Navarra');
require('dotenv').config();

// Initialize the Game class with port number
const game = new Navarra(9000);

// Start the game server.
game.start();

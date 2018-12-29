/** ***************************************
Delaford
a fun medieval 2d javascript rpg
https://delaford.com
***************************************** */

// Webpack aliases
const moduleAlias = require('module-alias');

// Start Express
const path = require('path');
const http = require('http');
const compression = require('compression');
const express = require('express');
const enforce = require('express-sslify');

moduleAlias.addAlias('shared', `${__dirname}/src/shared`);

const onProduction = process.env.NODE_ENV === 'production'; // Accomodate process.env and eqeqeq eslint rule
const serverFolder = onProduction ? 'build' : 'server';
// eslint-disable-next-line
const world = require(`./${serverFolder}/core/world`);

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'production';
const app = express();

// Compress Express server bytes
app.use(compression());

// Enforce HTTPS in production
if (onProduction) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Start Express and use the correct env.
app.use(express.static(path.join(__dirname, onProduction ? '/dist' : '/')));

// Actual game server
console.log(`ENVIRONMENT: ${env} and PORT ${port}`);
// eslint-disable-next-line
const Delaford = require(`./${serverFolder}/Delaford`);

// Create server for websocket to listen on
const server = http.createServer(app);
server.listen(port);

// Initialize the Game class with port number
const game = new Delaford(server);

// Live update of world items and players
app.get('/world/items', (req, res) => res.send(world.items));
app.get('/world/players', (req, res) => res.send(world.players));
/** ************************************** */

// Start the game server.
game.start();

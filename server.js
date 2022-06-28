/** ***************************************
Delaford
a fun medieval 2d javascript rpg
https://delaford.com
***************************************** */

// Webpack aliases
const moduleAlias = require('module-alias');

// Start Express
const path = require('path');
const secure = require('ssl-express-www');
const http = require('http');
const compression = require('compression');
const express = require('express');

const onProduction = process.env.NODE_ENV === 'production'; // Accomodate process.env and eqeqeq eslint rule
const serverFolder = onProduction ? 'build' : 'server';
// eslint-disable-next-line
const world = require(`./${serverFolder}/core/world`);
moduleAlias.addAlias('shared', `${__dirname}/${serverFolder}/shared`);
moduleAlias.addAlias('root', `${__dirname}/${serverFolder}`);

const port = process.env.PORT || 6500;
const env = process.env.NODE_ENV || 'production';
const app = express();

app.use(secure);

// Compress Express server bytes
app.use(compression());

// Start Express and use the correct env.
app.use(express.static(path.join(__dirname, '/dist')));

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
// TODO Allow only on localhost.
// Make dynamic
app.get('/world/items', (req, res) => res.send(world.items));
app.get('/world/players', (req, res) => res.send(world.players));
app.get('/world/respawns', (req, res) => res.send(world.respawns));
app.get('/world/shops', (req, res) => res.send(world.shops));
/** ************************************** */

// Start the game server.
game.start();

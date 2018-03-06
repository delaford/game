const Authentication = require('./authentication');
const Player = require('./../core/player');
const world = require('../core/world');
const Socket = require('../socket');
const Map = require('./../core/map');

const emoji = require('node-emoji');

/**
 * A global event handler (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */
const handler = {
  /**
   * A player logins into the game
   */
  'player:login': async (data, ws) => {
    const { player, token } = await Authentication.login(data);
    Authentication.addPlayer(new Player(player, token, ws.id));
  },

  /**
   * A player logs out of the game
   */
  'player:logout': async (data, ws, context) => {
    context.constructor.close(ws, true);
  },

  /**
   * A player sends a chat message to everyone
   */
  'player:say': (data) => {
    const playerChat = world.players.find(p => p.socket_id === data.data.id);
    data.data.username = playerChat.username;

    console.log(`${emoji.get('speech_balloon')}  ${playerChat.username}: ${data.data.said}`);

    Socket.broadcast('player:say', data.data, 10);
  },

  /**
   * A player moves to a new tile via keyboard
   */
  'player:move': (data) => {
    const playerIndex = world.players.findIndex(player => player.uuid === data.data.id);
    world.players[playerIndex].move(data.data.direction);

    const playerChanging = world.players[playerIndex];
    Socket.broadcast('player:movement', playerChanging);
  },

  /**
   * A player moves to a new tile via mouse
   */
  'player:mouseTo': async (data) => {
    const movingData = data.data;
    const { x, y } = movingData.coordinates;

    const playerIndexMoveTo = world.players.findIndex(p => p.uuid === movingData.id);
    const matrix = await Map.getMatrix(world.players[playerIndexMoveTo]);

    world.players[playerIndexMoveTo].path.grid = matrix;
    world.players[playerIndexMoveTo].path.current.walkable = true;

    Map.findPath(movingData.id, x, y);
  },
};

module.exports = handler;

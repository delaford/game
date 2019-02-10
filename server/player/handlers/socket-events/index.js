/**
 * Events from socket.
 * for example: (login, logout, queue. etc.)
 */

const Authentication = require('./../../authentication');
const Player = require('./../../../core/player');
const Socket = require('../../../socket');
const world = require('../../../core/world');
const playerGuest = require('../../../core/data/helpers/player.json');

export default {
  /**
   * A player logins into the game
   */
  'player:login': async (data, ws) => {
    try {
      if (!data.data.useGuestAccount) {
        const { player, token } = await Authentication.login(data);
        Authentication.addPlayer(new Player(player, token, ws.id));
      } else {
        Authentication.addPlayer(new Player(playerGuest, 'none', ws.id));
      }
    } catch (error) {
      console.log(error);
      console.log(`${data.data.username} logged in with a bad password.`);

      Socket.emit('player:login-error', {
        data: JSON.stringify(error),
        player: { socket_id: ws.id },
      });
    }
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
  'player:say': ({ data }) => {
    const { id, said } = data;
    const { username } = world.players.find(p => p.socket_id === id);

    // Put a limit on the length of a player message to 50 characters.
    const text = said.length > 50 ? said.substring(0, 50) : said;

    Socket.broadcast('player:say', {
      username,
      type: 'chat',
      text,
    });
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
   * Queue up an player action to executed they reach their destination
   */
  'player:queueAction': (data) => {
    const playerIndex = world.players.findIndex(p => p.socket_id === data.player.socket_id);

    world.players[playerIndex].queue.push(data);
    world.players[playerIndex].action = data.actionToQueue;
  },

  'player:pane:close': (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);

    world.players[playerIndex].currentPane = false;
  },
};


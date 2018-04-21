const Authentication = require('./authentication');
const Player = require('./../core/player');
const world = require('../core/world');
const Socket = require('../socket');
const Map = require('./../core/map');

const items = require('../data/items');

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

  /**
   * Queue up an player action to executed they reach their destination
   */
  'player:queueAction': (data) => {
    const playerIndex = world.players.findIndex(p => p.socket_id === data.data.player.socket_id);

    world.players[playerIndex].queue.push(data.data);
  },

  'player:inventoryItemDrop': (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
    world.players[playerIndex].inventory = world.players[playerIndex].inventory
                                              .filter((_, i) => i !== data.data.slot);
    Socket.broadcast('player:movement', world.players[playerIndex]);

    world.items.push({
      id: data.data.droppingItem,
      x: world.players[playerIndex].x,
      y: world.players[playerIndex].y,
    });

    Socket.broadcast('world:itemDropped', world.items);
  },

  'item:equip': (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
    const getItem = items.find(i => i.id === data.data.item);

    const item = {
      stackable: getItem.stackable,
      graphics: getItem.graphics,
      itemID: getItem.id,
    };

    world.players[playerIndex].wear[getItem.slot] = item;
    world.players[playerIndex].inventory.splice(data.data.slot, 1);

    Socket.broadcast('player:equippedAnItem', world.players[playerIndex]);
  },

  'item:unequip': (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
    const getItem = items.find(i => i.id === data.data.item);

    const item = {
      stackable: getItem.stackable,
      graphics: getItem.graphics,
      itemID: getItem.id,
    };

    world.players[playerIndex].wear[getItem.slot] = null;
    world.players[playerIndex].inventory.push(item);
    Socket.broadcast('player:unequippedAnItem', world.players[playerIndex]);
  },
};

module.exports = handler;

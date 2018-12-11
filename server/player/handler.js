const Authentication = require('./authentication');
const Player = require('./../core/player');
const world = require('../core/world');
const Socket = require('../socket');
const Map = require('./../core/map');
const playerGuest = require('../core/data/helpers/player.json');

const { wearableItems } = require('../core/data/items');

const pipe = require('./pipeline');

/**
 * A global event handler (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */
const handler = {
  'fetch:items': () => {
    console.log('Fetching items for player... ', wearableItems.length);
    Socket.emit('server:send:items', wearableItems);
  },
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
    } catch (e) {
      console.log(e.message);
      Socket.emit('player:login-error', e);
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
  'player:say': (data) => {
    const playerChat = world.players.find(p => p.socket_id === data.data.id);
    data.data.username = playerChat.username;

    // eslint-disable-next-line
    console.log(`${playerChat.username}: ${data.data.said}`);

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
      .filter(v => v.slot !== data.data.item.slot);
    Socket.broadcast('player:movement', world.players[playerIndex]);

    // Add item back to the world
    // from the grasp of the player!
    world.items.push({
      id: data.data.item.id,
      uuid: data.data.item.uuid,
      x: world.players[playerIndex].x,
      y: world.players[playerIndex].y,
      timestamp: Date.now(),
    });

    console.log(`Dropping: ${data.data.item.id} at ${world.players[playerIndex].x}, ${world.players[playerIndex].x}`);

    Socket.broadcast('world:itemDropped', world.items);
  },

  /**
   * A player equips an item from their inventory
   */
  'item:equip': async (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
    const getItem = wearableItems.find(i => i.id === data.data.item.id);
    const alreadyWearing = world.players[playerIndex].wear[getItem.slot];
    if (alreadyWearing) {
      await pipe.player.unequipItem({
        data: {
          item: {
            uuid: alreadyWearing.uuid,
            id: alreadyWearing.id,
            slot: data.data.item.slot,
          },
          id: data.data.id,
          replacing: true,
        },
      });

      pipe.player.equippedAnItem(data);
    } else {
      pipe.player.equippedAnItem(data);
    }
  },

  /**
   * A player unequips an item from their wear tab
   */
  'item:unequip': (data) => {
    pipe.player.unequipItem(data);
  },

  'game:fetch:items': () => {
    const itemsToSend = wearableItems.map(i => ({
      stats: i.stats,
      name: i.name,
      graphics: i.graphics,
      id: i.id,
    }));

    Socket.emit('game:receive:items', itemsToSend);
  },
};

module.exports = handler;

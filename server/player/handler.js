import Action from '../core/action';
import ContextMenu from './../core/context-menu';

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
const Handler = {
  /**
   * Initalizing the handler.
   * Every request comes through here.
   */
  'player:do': (incoming) => {
    const miscData = incoming.data.data.item.miscData || false;
    const action = new Action(incoming.data.player.socket_id, miscData);
    action.do(incoming.data.data, incoming.data.queueItem);
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
    // TODO
    // Only broadcast to players who are in a 7x5 tile radius
    // of where the message was originally sent from
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
   * A player moves to a new tile via mouse
   */
  'player:mouseTo': async (data) => {
    const movingData = data.data;
    const { x, y } = movingData.coordinates;

    const playerIndexMoveTo = world.players.findIndex(p => p.uuid === movingData.id);
    const matrix = await Map.getMatrix(world.players[playerIndexMoveTo]);

    world.players[playerIndexMoveTo].path.grid = matrix;
    world.players[playerIndexMoveTo].path.current.walkable = true;

    const location = movingData.location || null;

    Map.findPath(movingData.id, x, y, location);
  },

  /**
   * Queue up an player action to executed they reach their destination
   */
  'player:queueAction': (data) => {
    const playerIndex = world.players.findIndex(p => p.socket_id === data.player.socket_id);

    world.players[playerIndex].queue.push(data);
  },

  'player:inventoryItemDrop': (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.id);
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
    const playerIndex = world.players.findIndex(p => p.uuid === data.id);
    const getItem = wearableItems.find(i => i.id === data.data.item.id);
    const alreadyWearing = world.players[playerIndex].wear[getItem.slot];
    if (alreadyWearing) {
      await pipe.player.unequipItem({
        data: {
          item: {
            name: data.data.item.name,
            uuid: alreadyWearing.uuid,
            id: alreadyWearing.id,
            slot: data.data.item.slot,
          },
          replacing: true,
        },
        id: data.id,
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

  /**
   * Start building the context menu for the player
   */
  'game:menu:build': async (incomingData) => {
    const contextMenu = new ContextMenu(
      incomingData.data.player,
      incomingData.data.tile,
      incomingData.data.miscData,
    );

    const items = await contextMenu.build();

    Socket.emit('game:context-menu:items', {
      data: items,
      player: incomingData.data.player,
    });
  },
};

export default Handler;

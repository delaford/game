import { general, wearableItems, smithing } from '@server/core/data/items';

import Authentication from '@server/player/authentication';
import Handler from '@server/player/handler';
import Item from '@server/core/item';
import Map from '@server/core/map';
import NPC from '@server/core/npc';
import Socket from '@server/socket';
import emoji from 'node-emoji';
import uuid from 'uuid/v4';
import world from '@server/core/world';

class Delaford {
  constructor(server) {
    // Port setting
    world.socket = new Socket(server);

    // Start the game server
    console.log(`${emoji.get('rocket')}  Starting game server...`);

    // Load the map and spawn the default entities
    this.constructor.loadMap();
    this.loadEntities();
  }

  /**
   * Load the new map after the game starts
   */
  static loadMap() {
    console.log(`${emoji.get('european_castle')}  Creating a new map...`);
    world.map = new Map('surface');
  }

  /**
   * Load default entities before the start of game world
   */
  loadEntities() {
    NPC.load(this);
  }

  /**
   * Create the new server with the port
   */
  start() {
    setInterval(() => {
      NPC.movement();
    }, 2000);

    setInterval(() => {
      Item.check();
      Item.resourcesCheck();
    }, 1000);

    // Bind the websocket connection to the `this` context
    world.socket.ws.on('connection', this.connection.bind(this));
  }

  /**
   * Log the user out and save the player profile
   *
   * @param {WebSocket} ws The socket connection of the player
   * @param {boolean} logout Whether the connection was via player or interruption
   */
  static async close(ws, logout = false) {
    const player = world.players.find(f => f.socket_id === ws.id);

    if (player) {
      // Logout the player out and save the profile
      try {
        await player.update();
        await Authentication.logout(player.token);

        console.log(`${emoji.get('red_circle')}  Player ${player.username} left the game`);

        // Remove player from the list.
        world.players = world.players.filter(p => p.socket_id !== ws.id);

        // If the user did not logout,
        // then we remove them from list
        if (!logout) {
          world.clients = world.clients.filter(c => c.id !== ws.id);
        }

        // Tell the clients someone left
        Socket.broadcast('player:left', ws.id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
   * Connect all incoming websocket calls to their approrpriate methods
   *
   * @param {WebSocket} ws The websocket connection
   */
  connection(ws) {
    // Assign UUID to every connection
    ws.id = uuid();

    // Add player to server's player list
    console.log(`${emoji.get('computer')}  A client (${ws.id.substring(0, 5)}...) connected.`);
    world.clients.push(ws);

    // Only return needed values for client
    const allItems = [...wearableItems, ...general, ...smithing].map((i) => {
      const item = {
        name: i.name,
        id: i.id,
        graphics: i.graphics,
      };

      return item;
    });

    // Send player server items
    Socket.emit('server:send:items', {
      player: { socket_id: ws.id },
      items: allItems,
    });

    ws.on('message', async (msg) => {
      const data = JSON.parse(msg);

      // Client-sent events from WebSocket
      // are processed through this method
      Handler[data.event](data, ws, this);
    });

    ws.on('error', e => console.log(e, `${ws.id} has left`));
    ws.on('close', () => this.constructor.close(ws));
  }
}

module.exports = Delaford;

const WebSocketServer = require('ws').Server;
const world = require('./core/world');

class Socket {
  constructor(server) {
    this.ws = new WebSocketServer({ server });
    this.clients = world.clients;
  }

  /**
   * Emit an event to a single client
   *
   * @param {string} event The type of event being emitted
   * @param {object} data The data associated with the event
   */
  static emit(event, data) {
    const obj = {
      event,
      data,
    };

    const player = world.clients.find((p) => {
      let transitiveID = p.id;
      if (data.player) {
        transitiveID = data.player.socket_id;
      }

      return p.id === transitiveID;
    });

    player.send(JSON.stringify(obj));
  }

  /**
   * Broadcast an event to all clients connected in-game
   *
   * @param {string} event The type of event I am broadcasting
   * @param {object} data Data associated with the event
   */
  static broadcast(event, data) {
    const obj = {
      event,
      data,
    };

    world.clients.forEach((client, index) => {
      const getSender = world.players.find(p => p.socket_id === client.id);

      if (world.players.length && getSender) {
        if (client.readyState === 3) {
          world.clients.splice(index, 1);
        }
        const getPlayer = world.clients.find(c => c.id === client.id);

        if (getPlayer && (client.readyState === getPlayer.readyState) && (world.clients.length)) {
          client.send(JSON.stringify(obj));
        }
      }
    });

    world.clients = world.clients.filter(client => client.readyState !== 3);
  }
}

module.exports = Socket;

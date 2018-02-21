const WebSocket = require('ws').Server;
const world = require('./core/world');

class Socket {
  constructor(port) {
    this.ws = new WebSocket({ port });
    this.clients = world.clients;
  }

  static emit(event, data) {
    const obj = {
      event,
      data,
    };

    const player = world.clients.find(p => p.id === data.player.socket_id);

    player.send(JSON.stringify(obj));
  }

  static broadcast(event, data) {
    // Refresh player list
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

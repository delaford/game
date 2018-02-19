const WebSocket = require('ws').Server;
const world = require('./core/world');

class Socket {
  constructor(port) {
    this.ws = new WebSocket({ port });
    this.clients = world.clients;
  }

  emit(event, data) {
    const obj = {
      event,
      data,
    };

    const player = world.clients.find(p => p.id === data.player.socket_id);

    player.send(JSON.stringify(obj));
  }

  broadcast(event, data, range = 0) {
    // Refresh player list
    this.clients = world.clients;

    const obj = {
      event,
      data,
    };

    this.clients.forEach((client, index) => {
      const getSender = world.players.find(p => p.socket_id === client.id);

      if (world.players.length && getSender) {

        if (client.readyState === 3) {
          this.clients.splice(index, 1);
        }
        const getPlayer = world.clients.find(c => c.id === client.id);

        if (getPlayer && (client.readyState === getPlayer.readyState) && (world.clients.length)) {
          if (range === 0) {
            client.send(JSON.stringify(obj));
          } else {
            client.send(JSON.stringify(obj));
          }
        }
      }
    });

    this.clients = this.clients.filter(client => client.readyState !== 3);
  }
}

module.exports = Socket;

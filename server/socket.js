const WebSocket = require('ws').Server;
const world = require('./core/world');

class Socket {
  constructor(port) {
    this.ws = new WebSocket({ port });
    this.clients = world.clients;
    this.context = null;
  }

  emit(event, data) {
    const obj = {
      event,
      data,
    };

    this.context.send(JSON.stringify(obj));
  }

  broadcast(data) {
    const that = this;

    this.clients.forEach((client) => {
      if (client.readyState === that.context.OPEN) {
        console.log(data);
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = Socket;

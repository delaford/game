import WebSocket from 'ws';
import world from '@server/core/world';

/**
 * IDEA: Create seperate socket classes,
 * one for server and one for player???
 */

class Socket {
  constructor(server) {
    this.ws = new WebSocket.Server({ server });
    this.clients = world.clients;
  }

  /**
   * Emit an event to a single client
   *
   * @param {string} event The type of event being emitted
   * @param {object} data The data associated with the event
   */
  static emit(event, data) {
    if (!data.player.socket_id) {
      console.log(event, 'No player socket ID connected.');
    }

    // Find player wanting the emit request
    const player = world.clients.find(p => p.id === data.player.socket_id);

    // Send the player back their needed data
    player.send(JSON.stringify({
      event,
      data,
    }));
  }

  /**
   * Broadcast an event to all clients connected in-game
   *
   * @param {string} event The type of event I am broadcasting
   * @param {object} data Data associated with the event
   */
  static broadcast(event, data, players) {
    const obj = {
      event,
      data,
    };

    world.clients.forEach((client, index) => {
      if (!players || players.find(p => p.socket_id === client.id)) {
        const sender = world.players.find(p => p.socket_id === client.id);

        if (world.players.length && sender) {
          if (client.readyState === 3) {
            world.clients.splice(index, 1);
          }
          const player = world.clients.find(c => c.id === client.id);

          if (player && (client.readyState === player.readyState) && (world.clients.length)) {
            client.send(JSON.stringify(obj));
          }
        }
      }
    });

    world.clients = world.clients.filter(client => client.readyState !== 3);
  }

  static sendMessageToPlayer(playerIndex, message) {
    this.emit('game:send:message', {
      player: { socket_id: world.players[playerIndex].socket_id },
      text: message,
    });
  }
}

module.exports = Socket;

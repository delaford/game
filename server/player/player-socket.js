import world from '@server/core/world';

class PlayerSocket {
  constructor(socketId) {
    this.client = world.clients.find(p => p.id === socketId);
  }

  emit(event, data) {
    // Send the player back their needed data
    this.client.send(JSON.stringify({
      event,
      data,
    }));
  }
}

export default PlayerSocket;

class Socket {
  /**
   * Send an event from the server
   *
   * @param {string} event The event to send out
   * @param {object} data The data regarding the event
   */
  static emit(event, data) {
    window.ws.send(JSON.stringify({
      event,
      data,
    }));
  }
}

export default Socket;

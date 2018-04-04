class Socket {
  static emit(event, data) {
    window.ws.send(JSON.stringify({
      event,
      data,
    }));
  }
}

export default Socket;

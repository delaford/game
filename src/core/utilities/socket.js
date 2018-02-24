class Socket {
  static emit(event, data) {
    const handledData = {
      event,
      data,
    };

    window.ws.send(JSON.stringify(handledData));
  }
}

export default Socket;

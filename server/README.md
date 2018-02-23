# Server.js

Navarra uses WebSockets, plain and simple, to transmit actions from the player to the server.

Please refer to the graph below to see how certain actions are validated and checked.

![Server client](https://preview.ibb.co/eg8B2c/server_client.png"Server-client")

## The Server

The server keeps track of the `world` object which is what keeps track of all mutable objects like where players are on the map, the clients connected, the monsters and items on the map and so forth.

When a user requests an action (like to move), the `WebSocket` server talks to the `Node.js` server and sees if it that specific action is allowed. If allowed, update the `world` variable server-side in the `Node.js` server and then broadcast via the `Websocket` server and let the clients know of the updated value.

The clients then recieves the update and apply it to their client and the `Engine.js` client-side will repaint accordingly based on the new values.

This all happens within a second or less and it's all basic, standard within the game. Nothing fancy here...

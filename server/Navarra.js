const Authentication = require('./lib/authentication');
const Socket = require('./socket');
const uuid = require('node-uuid');

const npcs = require('./data/npcs');

// Default entities
const NPC = require('./core/npc');
const Map = require('./core/map');
const Player = require('./core/player');

// Tools
const UI = require('./core/utilities/ui');
const emoji = require('node-emoji');

// World
const world = require('./core/world');
const { droppedItems } = require('./data/default');

const config = require('./core/config');
const PF = require('pathfinding');

class Navarra {
  constructor(port) {
    // Port setting
    world.socket = new Socket(9000);

    // Start the game server
    console.log(`${emoji.get('rocket')}  Starting game server on port ${port}.`);
    this.constructor.loadMap();
    this.loadEntities();
  }

  static loadMap() {
    console.log(`${emoji.get('european_castle')}  Creating a new map...`);
    world.items = droppedItems;
    world.map = new Map('surface');
  }

  loadEntities() {
    // Push default NPCs into game world
    npcs.forEach((npc) => {
      world.npcs.push(new NPC(npc));
    }, this);
    console.log(`${emoji.get('walking')}  Loading NPCs...`);
  }

  /**
   * Handle NPC movement on map
   */
  static npcMovement() {
    world.npcs.map((npc) => {
      // Next movement allowed in 2.5 seconds
      const nextActionAllowed = npc.lastAction + 2500;

      if (npc.lastAction === 0 || nextActionAllowed < Date.now()) {
        // Are they going to move or sit still this time?
        const action = UI.getRandomInt(1, 2) === 1 ? 'move' : 'nothing';

        // NPCs going to move during this loop?
        if (action === 'move') {
          // Which way?
          const direction = ['up', 'down', 'left', 'right'];
          const going = direction[UI.getRandomInt(0, 3)];

          // What tile will they be stepping on?
          const tile = {
            background: UI.getFutureTileID(world.map.background, npc.x, npc.y, going),
            foreground: UI.getFutureTileID(world.map.foreground, npc.x, npc.y, going),
          };

          switch (going) {
            default:
            case 'up':
              if ((npc.y - 1) >= (npc.spawn.y - npc.range)) {
                if (UI.tileWalkable(tile.background) && UI.tileWalkable(tile.foreground)) {
                  npc.y -= 1;
                }
              }
              break;
            case 'down':
              if ((npc.y + 1) <= (npc.spawn.y + npc.range)) {
                if (UI.tileWalkable(tile.background) && UI.tileWalkable(tile.foreground)) {
                  npc.y += 1;
                }
              }
              break;
            case 'left':
              if ((npc.x - 1) >= (npc.spawn.x - npc.range)) {
                if (UI.tileWalkable(tile.background) && UI.tileWalkable(tile.foreground)) {
                  npc.x -= 1;
                }
              }
              break;
            case 'right':
              if ((npc.x + 1) <= (npc.spawn.x + npc.range)) {
                if (UI.tileWalkable(tile.background) && UI.tileWalkable(tile.foreground)) {
                  npc.x += 1;
                }
              }
              break;
          }
        }

        // Register their last action
        npc.lastAction = Date.now();
      }

      return npc;
    });

    // if (world.socket.clients) {
    //   world.socket.clients.forEach((client) => {
    //     if (client.readyState === WebSocket.OPEN) {
    //       if (world.bus) {
    //         world.bus.emit('npc:movement', world.npcs);
    //       }
    //     }
    //   });
    // }
  }

  /**
   * Create the new server with the port
   */
  start() {
    setInterval(() => {
      this.constructor.npcMovement();
    }, 2000);

    this.build();
  }

  /**
   * Bind the websocket connection to the `this` context
   */
  build() {
    world.socket.ws.on('connection', this.connection.bind(this));
  }

  static close(ws) {
    console.log(ws.id, 'left');

    // Event bus (for actions)
    const player = world.players.find(f => f.socket_id === ws.id);

    if (player) {
      console.log(`${emoji.get('red_circle')}  Player ${player.username} left the game`);

      // Remove player from the list.
      world.players = world.players.filter(p => p.socket_id !== ws.id);

      // Send new player list out.
      // ws-send...
    }
  }

  /**
   * Connect all incoming websocket calls to their approrpriate methods
   *
   * @param {WebSocket} ws The websocket connection
   */
  connection(ws) {
    console.log(`${emoji.get('computer')}  Someone connected.`);

    world.socket.context = ws;


    ws.on('message', async (msg) => {
      const data = JSON.parse(msg);

      switch (data.event) {
        default:
          break;
        case 'player:login':
          const { player, token } = await Authentication.login(data);
          const socketId = ws.id;


          this.constructor.addPlayer(new Player(player, token, socketId));
          break;
      }

      // world.socket.broadcast(JSON.parse(msg));
    });


    // Assign UUID to every connection
    ws.id = uuid.v4();

    world.clients.push(ws);

    // world.clients.forEach((client) => {
    //   console.log(`${client.id} was told of existance.`);

    //   client.send('dan', {
    //     any: 'json',
    //   });
    // });

    // 1. Player
    ws.on('player:login', async (incoming) => {
      const { player, token } = await Authentication.login(world.bus, incoming);
      const socketId = ws.id;


      this.constructor.addPlayer(new Player(player, token, socketId), world.bus);
    });

    // world.bus.on('player:move', (incoming) => {
    //   const playerIndex = world.players.findIndex(player => player.uuid === incoming.id);
    //   world.players[playerIndex].move(incoming.direction);

    //   const playerChanging = world.players[playerIndex];
    //   world.socket.clients.forEach((client) => {
    //     if (client.readyState === WebSocket.OPEN) {
    //       if (world.bus) {
    //         world.bus.emit('player:movement', playerChanging);
    //       }
    //     }
    //   });
    // });

    // world.bus.on('player:mouseTo', async (data) => {
    //   const { x, y } = data.coordinates;

    //   const playerIndex = world.players.findIndex(p => p.uuid === data.id);

    //   const matrix = await Navarra.getMatrix(world.players[playerIndex]);

    //   world.players[playerIndex].path.grid = matrix;
    //   // cheating for now...
    //   world.players[playerIndex].path.current.walkable = true;

    //   world.map.findPath(data.id, x, y);
    // });

    ws.on('error', e => console.log(e, `${ws.id} has left`));
    ws.on('close', () => this.constructor.close(ws));
  }

  static getMatrix(player) {
    const x = player.x;
    const y = player.y;

    const { size, viewport } = config.map;

    return new Promise((resolve) => {
      const tileCrop = {
        x: x - Math.floor(0.5 * viewport.x),
        y: y - Math.floor(0.5 * viewport.y),
      };

      const matrix = [];

      // Drawing the map row by column.
      for (let column = 0; column <= viewport.y; column += 1) {
        const grid = [];
        for (let row = 0; row <= viewport.x; row += 1) {
          const tileToFind = (((column + tileCrop.y) * size.x) + row) + tileCrop.x;
          const backgroundTile = world.map.background[tileToFind] - 1;
          const foregroundTile = (world.map.foreground[tileToFind] - 1) - 252;
          // 252 because of the gid problem in Tiled

          // Is the background walkable?
          let walkable = UI.tileWalkable(backgroundTile) ? 0 : 1;
          // If it is not, is the foreground walkable?
          if (walkable === 0) walkable = UI.tileWalkable(foregroundTile, 'foreground') ? 0 : 1;

          // Push the block/non-blocked tile to the
          // grid so that the pathfinder can use it
          grid.push(walkable);
        }

        // Push blocked/non-blocked array for pathfinding
        matrix.push(grid);
      }

      // The new walkable/non-walkable grid
      resolve(new PF.Grid(matrix));
    });
  }

  static addPlayer(player) {
    world.players.push(player);

    const block = {
      player,
      map: world.map,
      npcs: world.npcs,
      droppedItems: world.items,
    };

    world.socket.emit('login-data', block);
  }
}

module.exports = Navarra;

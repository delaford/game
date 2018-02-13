const Authentication = require('./socket/authentication');

const wsEvents = require('ws-events');
const WebSocket = require('ws');
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

class Navarra {
  constructor(port) {
    this.port = port;

    // Initialize empty entities
    this.map = null;
    this.npcs = [];
    this.players = [];

    this.ws = null;
    this.bus = null;

    console.log(`${emoji.get('rocket')} Starting game server on port ${port}. ${emoji.get('star2')}`);
    this.constructor.loadMap();
    this.loadEntities();
  }

  static loadMap() {
    console.log(`${emoji.get('european_castle')} Creating a new map...`);
    world.map = new Map('surface');
  }

  loadEntities() {
    // Let's load world map with default NPCs and map
    npcs.forEach((npc) => {
      world.npcs.push(new NPC(npc));
    }, this);
    console.log(`${emoji.get('walking')} Loading NPCs...`);

    if (world.map.foreground) this.npcMovement();
  }

  /**
   * Handle NPC movement on map
   */
  npcMovement() {
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

    const that = this;

    if (this.socket) {
      this.socket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          if (that.bus) {
            that.bus.emit('npc:movement', world.npcs);
          }
        }
      });
    }
  }

  /**
   * Create the new server with the port
   */
  start() {
    this.socket = new WebSocket.Server({ port: this.port });

    this.build();
  }

  /**
   * Bind the websocket connection to the `this` context
   */
  build() {
    this.socket.on('connection', this.connection.bind(this));
  }

  close(ws) {
    // Event bus (for actions)
    const player = world.players.find(f => f.socket_id === ws.id);

    if (player) {
      this.ws = ws;
      this.bus = wsEvents(ws);
      console.log(`${emoji.get('red_circle')} Player ${player.username} left the game`);

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
    // Event bus (for actions)
    this.ws = ws;
    this.bus = wsEvents(ws);
    console.log(`${emoji.get('computer')} Someone connected.`);

    // Assign UUID to every connection
    ws.id = uuid.v4();

    setInterval(() => {
      this.npcMovement();
    }, 2000);

    // 1. Player
    this.bus.on('player:login', async (incoming) => {
      const { player, token } = await Authentication.login(this.bus, incoming);
      const socketId = ws.id;

      this.constructor.addPlayer(new Player(player, token, socketId), this.bus);
    });

    this.bus.on('player:move', (incoming) => {
      const playerIndex = world.players.findIndex(player => player.uuid === incoming.id);
      world.players[playerIndex].move(incoming.direction, world.map);

      const that = this;
      const playerChanging = world.players[playerIndex];
      this.socket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          if (that.bus) {
            that.bus.emit('player:movement', playerChanging);
          }
        }
      });
    });

    this.bus.on('player:mouseTo', (data) => {
      const { x, y } = data.coordinates;
      world.map.findPath(data.id, x, y);
    });

    ws.on('close', () => this.close(ws));
  }

  static addPlayer(player, bus) {
    world.players.push(player);

    const block = {
      player,
      map: world.map,
      npcs: world.npcs,
    };

    bus.emit('login-data', block);
  }
}

module.exports = Navarra;

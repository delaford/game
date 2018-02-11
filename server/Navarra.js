const Authentication = require('./socket/authentication');

const wsEvents = require('ws-events');
const WebSocket = require('ws');

const npcs = require('./entities/npcs');

// Default entities
const NPC = require('./core/npc');
const Map = require('./core/map');
const Player = require('./core/player');

// Tools
const UI = require('./core/utilities/ui');

class Navarra {
  constructor(port) {
    this.port = port;

    // Initialize empty entities
    this.map = null;
    this.npcs = [];

    this.players = [];

    this.ws = null;
    this.bus = null;

    console.log(`Starting game server ${port}`);
    this.loadMap();
    this.loadEntities();
  }

  async loadMap() {
    console.log('Creating a new map...');
    this.map = new Map('surface');
  }

  loadEntities() {
    // Let's load world map with default NPCs and map
    npcs.forEach(npc => this.npcs.push(new NPC(npc)), this);
    console.log('Loading defualt NPCs...');

    if (this.map.foreground) this.npcMovement();
  }

  /**
   * Handle NPC movement on map
   */
  npcMovement() {
    this.npcs.map((npc) => {
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
            background: UI.getFutureTileID(this.map.background, npc.x, npc.y, going),
            foreground: UI.getFutureTileID(this.map.foreground, npc.x, npc.y, going),
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

    this.socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (that.bus) {
          that.bus.emit('npc:movement', that.npcs);
        }
      }
    });
  }

  /**
   * Create the new server with the port
   */
  start() {
    this.socket = new WebSocket.Server({ port: this.port });

    this.build();
  }

  /**
   * Initialize the connect with the methods
   */
  build() {
    this.socket.on('connection', this.connection.bind(this));
  }

  /**
   * Connect all incoming websocket calls to their approrpriate methods
   *
   * @param {WebSocket} ws The websocket connection
   */
  connection(ws) {
    this.ws = ws;
    this.bus = wsEvents(ws);
    // Event bus (for actions)


    setInterval(() => {
      this.npcMovement();
    }, 2000);

    // 1. Player
    this.bus.on('player:login', async (incoming) => {
      const { player, token } = await Authentication.login(this.bus, incoming);

      this.addPlayer(new Player(player, token), this.bus);
    });
  }

  addPlayer(player, bus) {
    this.players.push(player);

    const block = {
      player,
      map: this.map,
      npcs: this.npcs,
    };

    bus.emit('login-data', block);
  }
}

module.exports = Navarra;

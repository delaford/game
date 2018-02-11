const Authentication = require('./socket/authentication');
const Assets = require('./socket/assets');

const wsEvents = require('ws-events');
const WebSocket = require('ws');

const npcs = require('./entities/npcs');

// Default entities
const NPC = require('./core/npc');
const Map = require('./core/map');
const Player = require('./core/player');

class Navarra {
  constructor(port) {
    this.port = port;

    // Initialize empty entities
    this.map = null;
    this.npcs = [];

    this.players = [];

    console.log(`Starting game server ${port}`);
    this.loadEntities();
    this.loadMap();
  }

  async loadMap() {
    console.log('Creating a new map...');
    this.map = new Map('surface');
  }

  loadEntities() {
    // Let's load world map with default NPCs and map
    npcs.forEach(npc => this.npcs.push(new NPC(npc)), this);
    console.log('Loading defualt NPCs...');
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
    // Event bus (for actions)
    const bus = wsEvents(ws);

    // 1. Player
    bus.on('player:login', async (incoming) => {
      const { player, token } = await Authentication.login(bus, incoming);

      this.addPlayer(new Player(player, token), bus);
    });

    // 2. Asset managment
    bus.on('client:load-data', () => Assets.loadData(bus));
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

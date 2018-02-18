const surfaceMap = require('./../maps/layers/surface.json');
const config = require('./config');
const world = require('./../core/world');

class Map {
  constructor(level) {
    // Getters & Setters
    this.config = config;
    this.level = level;

    this.droppedItems = world.droppedItems;

    this.background = world.map.background;
    this.foreground = world.map.foreground;

    this.players = [];

    this.setUp();
  }

  /**
   * Load map tile data
   *
   * @returns {array}
   */
  static async load() {
    const data = await Map.fetchMap('surface');

    return data;
  }

  /**
   * Resolve a promise to find the path
   *
   * @param {integer} x The x-axis coord on where user clicked on game-gap
   * @param {integer} y The y-axis coord on where user clicked on game-gap
   */
  static findQuickestPath(x, y, playerIndex) {
    const player = world.players[playerIndex];
    return new Promise((resolve) => {
      resolve(player.path.finder.findPath(7, 5, x, y, player.path.grid));
    });
  }

  /**
   * Find a path and set that path in motion
   *
   * @param {string} uuid The unique user-id indentifying who is moving
   * @param {integer} x The x-axis coord on where user clicked on game-gap
   * @param {integer} y The y-axis coord on where user clicked on game-gap
   */
  async findPath(uuid, x, y) {
    const playerIndex = world.players.findIndex(p => p.uuid === uuid);

    if (world.players[playerIndex].moving) {
      this.path.current.interrupted = true;
    }

    // The player's x-y on map (always 7,5)
    // to where they clicked on the map
    const path = await Map.findQuickestPath(x, y, playerIndex);

    // Actively set mouse coordinates while walking
    // this.setMouseCoordinates(this.mouse.x, this.mouse.y);

    // If the tile we clicked on
    // can be walked on, continue ->
    // TODO - actually check
    if (world.players[playerIndex].path.current.walkable && path.length && path.length > 1) {
      world.players[playerIndex].path.current.path.walking = path;
      world.players[playerIndex].path.current.step = 0;

      // We start moving the player along their path
      world.players[playerIndex].walkPath(playerIndex);
    }
  }

  async setUp() {
    const board = await Map.load();

    this.background = board[0].data;
    this.foreground = board[1].data;
  }

  /**
   * Loads the map from an external JSON file
   *
   * @param {string} level The level of the map
   * @returns {array}
   */
  static fetchMap(level) {
    const mapToLoad = {
      surface: surfaceMap,
    };

    return new Promise((resolve) => {
      resolve(mapToLoad[level].layers);
    });
  }
}

module.exports = Map;

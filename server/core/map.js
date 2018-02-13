const surfaceMap = require('./../maps/layers/surface.json');
const config = require('./config');

// World
const world = require('./world');

class Map {
  constructor(level) {
    // Getters & Setters
    this.config = config;
    this.level = level;

    this.background = world.map.background;
    this.foreground = world.map.foreground;

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
  findQuickestPath(x, y) {
    return new Promise((resolve) => {
      resolve(this.path.finder.findPath(7, 5, x, y, this.path.grid));
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
    if (this.player.moving) {
      this.path.current.interrupted = true;
    }

    // The player's x-y on map (always 7,5)
    // to where they clicked on the map
    const path = await this.findQuickestPath(x, y);

    // Actively set mouse coordinates while walking
    this.setMouseCoordinates(this.mouse.x, this.mouse.y);

    // If the tile we clicked on
    // can be walked on, continue ->
    if (this.path.current.walkable && path.length && path.length > 1) {
      this.path.current.path.set = path;
      this.path.current.length = path.length;
      this.path.current.step = 0;
      this.path.current.name = window.btoa(Math.random()).slice(-4);

      // We start moving the player along their path
      this.player.walkPath(this.path.current, this);
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

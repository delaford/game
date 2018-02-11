const surfaceMap = require('./../maps/layers/surface.json');
const config = require('./config');

class Map {
  constructor(level) {
    // Getters & Setters
    this.config = config;
    this.level = level;

    this.background = null;
    this.foreground = null;

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

  async setUp() {
    const board = await Map.load();

    this.background = board[0];
    this.foreground = board[1];
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

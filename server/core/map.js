const PF = require('pathfinding');
const config = require('./../core/config');
const surfaceMap = require('./../maps/layers/surface.json');
const world = require('./../core/world');
const UI = require('./../core/utilities/ui');
const { droppedItems } = require('./../data/default');

class Map {
  constructor(level) {
    // Getters & Setters
    this.players = [];
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
  static async findPath(uuid, x, y) {
    const playerIndex = world.players.findIndex(p => p.uuid === uuid);

    if (world.players[playerIndex].moving) {
      world.players[playerIndex].path.current.interrupted = true;
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

  /**
   * Set up the map
   */
  async setUp() {
    // Load the board
    const board = await Map.load();

    // Set background and foreground tile data
    this.background = board[0].data;
    this.foreground = board[1].data;

    // Set items on map
    world.items = droppedItems;
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

  /**
   * Get the blocked/non-blocked tile-matrix of their viewport
   *
   * @param {object} player The player asking
   */
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
}

module.exports = Map;

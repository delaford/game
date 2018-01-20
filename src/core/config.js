const config = {
  /**
   * Game configuration
   *
   * All variables here tweak the design and UI of the game
   * so please be very careful when updating. Assets and images
   * are listed here as well -- so double check dimensions.
   */
  name: 'navarra',
  version: '0.0.1',
  map: {
    tileset: { // How big is the tileset?
      width: 0,
      height: 0,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      blocked: [31, 185, 185, 186, 187, 193, 194, 195, 196, 202, 203, 204, 205, 211, 212, 213, 214, 215], // TODO
    },
    objects: { // How big is the objects tileset?
      width: 0,
      height: 0,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      blocked: [114, 120, 119], // TODO
    },
    viewport: { // How big will our view be?
      x: 15,
      y: 10,
    },
    size: { // How big will our map be?
      x: 200,
      y: 200,
    },
    player: {
      x: 7,
      y: 5,
    },
  },
};

module.exports = config;

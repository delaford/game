const config = {
  /**
   * Game configuration
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
      blocked: [10, 31, 185, 185, 186, 187, 193, 194, 195, 196, 202, 203, 204, 205, 211, 212, 213, 214, 215], // TODO
    },
    objects: { // How big is the objects tileset?
      width: 0,
      height: 0,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      // (It's probably easier to include a
      //  list of non-walkables here, heh.)
      blocked: [204, 205, 206, 111, 114, 120, 119], // TODO
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

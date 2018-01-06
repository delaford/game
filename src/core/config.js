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
      width: 768,
      height: 800,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      blocked: [1, 442, 324, 289, 396, 567, 156, 424, 283, 426, 23, 343, 346, 446, 90, 493, 509, 494, 492, 502, 485, 501, 495],
    },
    viewport: { // How big will our view be?
      x: 15,
      y: 10,
    },
    size: { // How big will our map be?
      x: 100,
      y: 100,
    },
  },
  assets: [
    'src/assets/tiles/tileset.png', // Tileset
    'src/assets/graphics/actors/players/human.png', // Player
  ],
};

module.exports = config;

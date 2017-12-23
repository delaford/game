const config = {
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
    },
    viewport: { // How big will our view be?
      x: 15,
      y: 10,
    },
    size: { // How big will our map be?
      x: 25,
      y: 25,
    },
  },
  assets: [
    'src/assets/all_tiles.png', // Tileset
    'src/assets/player1.png', // Player
  ],
};

module.exports = config;

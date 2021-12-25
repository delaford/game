const config = {
  /**
   * Game configuration
   */
  name: 'delaford',
  version: '0.1.0',
  socket: {
    port: 9000,
  },
  map: {
    color: {
      item: '#ffaa00',
      npc: '#f9f920',
      player: '#ffffff',
      action: '#1ffe8c',
    },
    tileset: { // How big is the tileset?
      width: 0,
      height: 0,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      blocked: [3, 10, 15, 31, 184, 185, 186, 187, 193, 194, 195, 196, 202, 203, 204, 205, 211, 212, 213, 214, 215], // TODO
    },
    objects: { // How big is the objects tileset?
      width: 0,
      height: 0,
      tile: { // How big is each tile?
        width: 32,
        height: 32,
      },
      // eslint-disable-next-line
      blocked: [280, 281, 204, 205, 206, 111, 124, 114, 120, 119, 156, 157, 158], // TODO
      // eslint-disable-next-line
      walkable: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 115],
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
  player: {
    slots: {
      inventory: 24,
      bank: 200,
      trade: 16,
    },
  },
};

module.exports = config;

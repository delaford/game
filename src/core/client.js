import terrainTileset from '@/assets/tiles/terrain.png';
import objectsTileset from '@/assets/tiles/objects.png';

import npcImage from '@/assets/graphics/actors/npcs.png';
import playerImage from '@/assets/graphics/actors/players/human.png';
import weaponsImage from '@/assets/graphics/items/weapons.png';

import bus from '../core/utilities/bus';

class Client {
  constructor(data) {
    this.map = data.map;
    this.background = data.map.background.data;
    this.foreground = data.map.foreground.data;
    this.player = data.player;

    this.players = [];
    this.npcs = data.npcs;

    bus.$on('DRAW:MOUSE', ({ x, y }) => this.map.setMouseCoordinates(x, y));
  }

  async start() {
    return new Promise(async (resolve) => {
      const assets = await Promise.all(this.loadAssets());
      resolve(assets);
    });
  }

  /**
 * Load assets by passing them through
 * a new instance of Image() and resolve the array
 *
 * @return {array}
 */
  loadAssets() {
    const assets = [
      playerImage,
      npcImage,
      objectsTileset,
      terrainTileset,
      weaponsImage,
    ];

    const images = Object.values(assets).map(asset =>
      this.constructor.uploadImage(asset),
    );

    return images;
  }

  /**
   * New up an Image() and sets the source to image
   *
   * @param {string} path The path of the asset
   */
  static uploadImage(path) {
    const asset = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(403);
      image.src = path;
    });

    return asset;
  }
}

export default Client;

import player from '../tempdb/player';
import map from '../core/map';

class Game {
  constructor(assets) {
    this.assets = assets.reverse();
  }

  /**
   * Initiate game by loading assets and data
   *
   * @return {object}
   */
  async init() {
    const promisedData = {
      // Images from players, monsters, tileset and more
      images: await Promise.all(this.loadAssets()),

      // Load player and world data
      data: await this.constructor.loadData(),
    };

    return promisedData;
  }

  /**
   * Load assets by passing them through
   * a new instance of Image() and resolve the array
   *
   * @return {array}
   */
  loadAssets() {
    const images = this.assets.map(asset =>
      this.constructor.uploadImage(asset),
    );

    return images;
  }

  /**
   * Resolve data through for various channels
   *
   * @return {array}
   */
  static loadData() {
    const data = new Promise((resolve) => {
      const block = {
        map,
        player,
      };

      resolve(block);
    });

    return data;
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

export default Game;

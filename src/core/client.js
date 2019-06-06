import terrainTileset from '../assets/tiles/terrain.png';
import objectsTileset from '../assets/tiles/objects.png';

import npcImage from '../assets/graphics/actors/npcs.png';
import playerImage from '../assets/graphics/actors/players/human.png';
import weaponsImage from '../assets/graphics/items/weapons.png';
import armorImage from '../assets/graphics/items/armor.png';
import jewelryImage from '../assets/graphics/items/jewelry.png';
import generalImage from '../assets/graphics/items/general.png';

import bus from './utilities/bus';

import Socket from './utilities/socket';

import Map from './map';


class Client {
  constructor(data) {
    // The map object
    this.map = data.map;
    this.background = data.map.background;
    this.foreground = data.map.foreground;

    // Entities on map
    this.player = data.player;
    this.player.inventory = this.player.inventory.slots;
    this.players = [];
    this.droppedItems = data.droppedItems;
    this.npcs = data.npcs;

    // Tell client to draw mouse on canvas
    bus.$on('DRAW:MOUSE', ({ x, y }) => this.map.setMouseCoordinates(x, y));
  }

  /**
   * Build the local Map based on data from server
   */
  async buildMap() {
    return new Promise(async (resolve) => {
      const images = await this.start();

      const data = {
        droppedItems: this.droppedItems,
        map: this.map,
        npcs: this.npcs,
        player: this.player,
      };

      this.map = new Map(data, images);
      resolve(200);
    });
  }

  /**
   * Start loading assets from server
   */
  async start() {
    return new Promise(async (resolve) => {
      const assets = await Promise.all(this.loadAssets());
      resolve(assets);
    });
  }

  /**
   * Start building the map itself
   */
  async setUp() {
    const images = await this.start();
    this.map.setImages(images);
    this.map.setPlayer(this.player);
    this.map.setNPCs(this.npcs);
    this.map.setDroppedItems(this.droppedItems);
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
      armorImage,
      jewelryImage,
      generalImage,
    ];

    const images = Object.values(assets).map(asset => this.constructor.uploadImage(asset));

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

  /**
   * Move the player one tile
   *
   * @param {string} direction The direction the player moved
   */
  static move(data) {
    Socket.emit('player:move', data);
  }
}

export default Client;

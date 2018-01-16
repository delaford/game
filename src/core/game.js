import tilesetImage from '@/assets/tiles/tileset.png';
import npcImage from '@/assets/graphics/actors/npcs.png';
import playerImage from '@/assets/graphics/actors/players/human.png';
import weaponsImage from '@/assets/graphics/items/weapons.png';
import npcs from '@/tempdb/npcs';
import items from '@/tempdb/items';
import player from '@/tempdb/player';

import bus from '../core/utilities/bus';
import Map from './map';
import Player from './player';
import NPC from './npc';
import Item from './item';

class Game {
  constructor(assets) {
    this.assets = assets;

    this.map = null;
    this.board = null;
    this.player = null;
    this.items = [];
    this.npcs = [];

    bus.$on('DRAW:MOUSE', ({ x, y }) => this.map.setMouseCoordinates(x, y));
    bus.$on('PLAYER:MOVE', ({ x, y }) => this.map.findPath(x, y));
  }

  /**
   * The main entry point.
   *
   * Start the game.
   */
  async start() {
    return new Promise(async (resolve) => {
      // Load images and data
      const { images, data } = await this.init();

      // Create player
      this.player = new Player(data.player);

      // Create NPCs
      data.npcs.forEach(npc => this.npcs.push(new NPC(npc)), this);

      // Create items
      data.items.forEach(item => this.items.push(new Item(item)), this);
      debugger;
      // Load map data
      this.map = new Map('surface', images, this.player, this.npcs);
      this.board = await this.map.load();
      this.map.build(this.board);

      resolve(200);
    });
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
    const assets = [
      playerImage,
      tilesetImage,
      npcImage,
      weaponsImage,
    ];

    const images = Object.values(assets).map(asset =>
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
        map: Map,
        player,
        npcs,
        items,
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

  /**
   * Move the player one tile
   *
   * @param {string} direction The direction the player moved
   */
  move(direction) {
    this.player.move(direction, this.map);
  }
}

export default Game;

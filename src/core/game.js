import terrainTileset from '@/assets/tiles/terrain.png';
import objectsTileset from '@/assets/tiles/objects.png';

import npcImage from '@/assets/graphics/actors/npcs.png';
import playerImage from '@/assets/graphics/actors/players/human.png';
import npcs from '@/tempdb/npcs';
import player from '@/tempdb/player';

import bus from '../core/utilities/bus';
import Map from './map';
import Player from './player';
import NPC from './npc';

class Game {
  constructor() {
    this.map = null;
    this.background = null;
    this.foreground = null;
    this.player = null;
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

      // Load map data
      this.map = new Map('surface', images, this.player, this.npcs);

      // Set data
      const mapData = await this.map.load();
      this.background = mapData[0].data;
      this.foreground = mapData[1].data;

      this.map.build([this.background, this.foreground], images);

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
      npcImage,
      objectsTileset,
      terrainTileset,
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

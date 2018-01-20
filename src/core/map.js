import PF from 'pathfinding';
import moveToMouse from '@/assets/graphics/ui/mouse/moveTo.png';
import blockedMouse from '@/assets/graphics/ui/mouse/blocked.png';
import config from './config';
import UI from './utilities/ui';
import bus from '../core/utilities/bus';
import surfaceMap from '../../server/maps/layers/surface.json';


class Map {
  constructor(level, [playerImage, npcsImage, objectImage, terrainImage], player, npcs) {
    // Getters & Setters
    this.config = config;
    this.level = level;

    // Image and data
    this.images = { playerImage, npcsImage, objectImage, terrainImage };
    this.background = null;
    this.foreground = null;
    this.player = player;
    this.npcs = npcs;

    this.path = {
      grid: null, // a 0/1 grid of blocked tiles
      finder: new PF.DijkstraFinder(),
      current: {
        name: '',
        length: 0, // Number of steps in current path
        path: {
          walking: [], // Current path walking
          set: [], // Current path from last walk-loop
        },
        step: 0, // Steps player has taken to walk
        walkable: false, // Did we click on a blocked tile?
        interrupted: false, // Did we click-to-walk elsewhere while walking current loop?
      },
    };

    this.mouse = {
      x: null,
      y: null,
      type: null,
      selection: new Image(),
    };

    // Canvas
    this.canvas = document.querySelector('.main-canvas');
    this.context = this.canvas.getContext('2d');

    // Listeners
    bus.$on('PLAYER:STOP_MOVEMENT', () => this.resetPath());
    bus.$on('MAP:SET_PATH', data => this.setPath(data));
  }

  /**
   * When player is doing walking
   */
  resetPath() {
    this.path = {
      grid: null,
      finder: new PF.DijkstraFinder(),
      current: {
        name: '',
        length: 0,
        path: {
          walking: [],
          set: [],
        },
        step: 0,
        walkable: false,
        interrupted: false,
      },
    };
  }

  /**
   * Starts to setup board canvas
   *
   * @param {array} board The tile index of the board
   * @param {array} images The image board assets
   */
  build(board, images) {
    const terrain = images[2];
    const objects = images[3];

    this.background = board[0];
    this.foreground = board[1];

    // Setup config from data here (this.config)
    this.config.map.tileset.width = terrain.width;
    this.config.map.tileset.height = terrain.height;

    this.config.map.objects.width = objects.width;
    this.config.map.objects.height = objects.height;

    this.setUpCanvas();
  }

  /**
   * Sets canvas dimensions and constructs it
   */
  setUpCanvas() {
    this.configureCanvas();
  }

  /**
   * Resolve a promise to find the path
   *
   * @param {integer} x The x-axis coord on where user clicked on game-gap
   * @param {integer} y The y-axis coord on where user clicked on game-gap
   */
  findQuickestPath(x, y) {
    return new Promise((resolve) => {
      resolve(this.path.finder.findPath(7, 5, x, y, this.path.grid));
    });
  }

  /**
   * Find a path and set that path in motion
   *
   * @param {integer} x The x-axis coord on where user clicked on game-gap
   * @param {integer} y The y-axis coord on where user clicked on game-gap
   */
  async findPath(x, y) {
    if (this.player.moving) {
      this.path.current.interrupted = true;
    }

    // The player's x-y on map (always 7,5)
    // to where they clicked on the map
    const path = await this.findQuickestPath(x, y);

    // Actively set mouse coordinates while walking
    this.setMouseCoordinates(this.mouse.x, this.mouse.y);

    // If the tile we clicked on
    // can be walked on, continue ->
    if (this.path.current.walkable && path.length && path.length > 1) {
      this.path.current.path.set = path;
      this.path.current.length = path.length;
      this.path.current.step = 0;
      this.path.current.name = window.btoa(Math.random()).slice(-4);

      // We start moving the player along their path
      this.player.walkPath(this.path.current, this);
    }
  }

  /**
   * Configure the canvas paramters correctly
   */
  configureCanvas() {
    const tileset = this.config.map.tileset;
    const canvasWidth = tileset.tile.width * (1 + this.config.map.viewport.x);
    const canvasHeight = tileset.tile.height * (1 + this.config.map.viewport.y);

    // Make sure canvas is set accordingly
    this.canvas.setAttribute('width', canvasWidth);
    this.canvas.setAttribute('height', canvasHeight);

    // Do not smooth any pixels painted on
    this.context.imageSmoothingEnabled = false;
  }

  /**
   * Set the coordinates to where the mouse currently is (if on canvas)
   *
   * @param {integer} x Mouse's x-axis on the canvas viewport
   * @param {integer} y Mouses's y-axus on the canvas viewport
   */
  setMouseCoordinates(x, y) {
    // eslint-disable-next-line
    let data = {
      mouse: {
        type: [moveToMouse, blockedMouse], // To add: Use, Attack
        current: 0,
      },
    };

    const tile = {
      background: UI.getTileOverMouse(
        this.background,
        this.player.x,
        this.player.y,
        x,
        y,
      ),
      foreground: UI.getTileOverMouse(
        this.foreground,
        this.player.x,
        this.player.y,
        x,
        y,
      ) - 252,
    };

    let isWalkable = UI.tileWalkable(tile.background);
    if (isWalkable && tile.foreground > -1) isWalkable = UI.tileWalkable(tile.foreground, 'foreground');

    this.path.current.walkable = isWalkable;

    if (!isWalkable) {
      data.mouse.current = 1;
    }

    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.type = data.mouse.current;
    this.mouse.selection.src = data.mouse.type[data.mouse.current];
  }

  /**
   * Draw the mouse selection on the canvas's viewport
   */
  drawMouse() {
    this.context.drawImage(this.mouse.selection, (this.mouse.x * 32), (this.mouse.y * 32), 32, 32);
  }

  /**
   * Set player's current path on first step
   *
   * @param {object} path The path from the first step in the walk-loop
   */
  setPath(path) {
    this.path.current.path.walking = path.path.set;
  }

  /**
   * Draw the player on the board
   */
  drawPlayer() {
    this.context.drawImage(
      this.images.playerImage,
      224,
      160,
      32,
      32,
    );
  }

  /**
   * Draw the NPCs on the game viewport canvas
   */
  drawNPCs() {
    // Filter out NPCs in viewport
    const nearbyNPCs = this.npcs.filter((npc) => {
      const foundNPCs = (this.player.x <= (8 + npc.x))
        && (this.player.x >= (npc.x - 8))
        && (this.player.y <= (6 + npc.y))
        && (this.player.y >= (npc.y - 6));

      return foundNPCs;
    });

    // Get relative X,Y coordinates to paint on viewport
    nearbyNPCs.forEach((npc) => {
      const viewport = {
        x: Math.floor(this.config.map.viewport.x / 2) - (this.player.x - npc.x),
        y: Math.floor(this.config.map.viewport.y / 2) - (this.player.y - npc.y),
      };

      // Paint the NPC on map
      this.context.drawImage(
        this.images.npcsImage,
        (npc.column * 32), // Number in NPC tileset
        0, // Y-axis always 0
        32,
        32,
        viewport.x * 32,
        viewport.y * 32,
        32,
        32,
      );
    }, this);
  }

  /**
   * Paint the map based on player's position
   */
  drawMap() {
    const x = this.player.x;
    const y = this.player.y;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { tileset, size, viewport, objects } = this.config.map;

    const divider = {
      background: tileset.width / tileset.tile.width,
      foreground: objects.width / tileset.tile.width,
    };

    const tileCrop = {
      x: x - Math.floor(0.5 * viewport.x),
      y: y - Math.floor(0.5 * viewport.y),
    };

    const matrix = [];

    // Drawing the map row by column.
    for (let column = 0; column <= viewport.y; column += 1) {
      const grid = [];
      for (let row = 0; row <= viewport.x; row += 1) {
        const tileToFind = (((column + tileCrop.y) * size.x) + row) + tileCrop.x;
        const backgroundTile = this.background[tileToFind] - 1;
        const foregroundTile = (this.foreground[tileToFind] - 1) - 252;
        // 252 because of the gid problem in Tiled

        // Is the background walkable?
        let walkable = UI.tileWalkable(backgroundTile) ? 0 : 1;
        // If it is not, is the foreground walkable?
        if (walkable === 0) walkable = UI.tileWalkable(foregroundTile, 'foreground') ? 0 : 1;

        // Push the block/non-blocked tile to the
        // grid so that the pathfinder can use it
        grid.push(walkable);

        // Get the correct tile to draw
        const tile = {
          clip: {
            background: {
              x: Math.floor(backgroundTile % divider.background) * tileset.tile.width,
              y: Math.floor(backgroundTile / divider.background) * tileset.tile.height,
            },
            foreground: {
              x: Math.floor(foregroundTile % divider.foreground) * tileset.tile.width,
              y: Math.floor(foregroundTile / divider.foreground) * tileset.tile.height,
            },
          },
          pos: {
            x: row * tileset.tile.width,
            y: column * tileset.tile.height,
          },
          width: tileset.tile.width,
          height: tileset.tile.height,
        };

        // Draw the background (terrain)
        this.context.drawImage(
          this.images.terrainImage, // The Image() instance
          tile.clip.background.x, // Coordinate to clip the X-axis
          tile.clip.background.y, // Coordinate to clip the Y-axis
          tile.width, // How wide, in pixels, to clip the sub-rectangle
          tile.height, // How tall, in pixels, to clip the sub-rectangle
          tile.pos.x, // Position the clipped picture along the X-axis
          tile.pos.y, // Position the clipped picture along the Y-axis
          tile.width, // The width, in pixels, to draw the image
          tile.height, // The height, in pixels, to draw the image
        );

        // Draw the foreground (objects)
        if (foregroundTile > -1) {
          this.context.drawImage(
            this.images.objectImage, // The Image() instance
            tile.clip.foreground.x,
            tile.clip.foreground.y,
            tile.width,
            tile.height,
            tile.pos.x,
            tile.pos.y,
            tile.width,
            tile.height,
          );
        }
      }

      // Push blocked/non-blocked array for pathfinding
      matrix.push(grid);
    }

    // The new walkable/non-walkable grid
    this.path.grid = new PF.Grid(matrix);
  }

  /**
   * Load map tile data
   *
   * @returns {array}
   */
  async load() {
    const data = await Map.fetchMap(this.level);

    return data;
  }

  /**
   * Loads the map from an external JSON file
   *
   * @param {string} level The level of the map
   * @returns {array}
   */
  static fetchMap(level) {
    const mapToLoad = {
      surface: surfaceMap,
    };

    return new Promise((resolve) => {
      resolve(mapToLoad[level].layers);
    });
  }
}

export default Map;

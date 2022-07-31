import PF from 'pathfinding';
import UI from 'shared/ui';
import config from 'root/config';
import blockedMouse from '@/assets/graphics/ui/mouse/blocked.png';
import bus from './utilities/bus';
import moveToMouse from '@/assets/graphics/ui/mouse/moveTo.png';

class Map {
  constructor(data, images) {
    this.foreground = data.map.foreground;
    this.background = data.map.background;

    this.images = [];
    this.npcs = [];
    this.config = config;

    this.droppedItems = [];
    this.players = [];
    this.player = null;

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

    // Mouse type and coordinates
    this.mouse = {
      x: null,
      y: null,
      type: null,
      selection: new Image(),
    };

    // Canvas
    this.canvas = document.querySelector('.main-canvas');
    this.context = this.canvas.getContext('2d');

    // Setup map
    this.setImages(images);
    this.setPlayer(data.player);
    this.setNPCs(data.npcs);
    this.setDroppedItems(data.droppedItems);
  }

  /**
   * Set the player
   *
   * @param {object} player The player themselves
   */
  setPlayer(player) {
    this.player = player;
  }

  /**
   * The NPCs of the map
   *
   * @param {object} npcs The world NPCS
   */
  setNPCs(npcs) {
    this.npcs = npcs;
  }

  /**
   * The items dropped on the map
   *
   * @param {object} items The items dropped on the map
   */
  setDroppedItems(items) {
    this.droppedItems = items;
  }

  /**
   * Set the images that was downloaded
   *
   * @param {Image} images Images of the player and terrain
   */
  setImages(images) {
    // Define images
    // eslint-disable-next-line
    const [playerImage, npcsImage, objectImage, terrainImage, weaponsImage, armorImage, jewelryImage, generalImage] = images;

    // Image and data
    this.images = {
      playerImage,
      npcsImage,
      objectImage,
      terrainImage,
      weaponsImage,
      armorImage,
      jewelryImage,
      generalImage,
    };

    // Tell client images are loaded
    bus.$emit('game:images:loaded');

    // Set image and config
    this.build();
  }

  /**
   * Starts to setup board canvas
   *
   * @param {array} board The tile index of the board
   * @param {array} images The image board assets
   */
  build() {
    const terrain = this.images.terrainImage;
    const objects = this.images.objectImage;

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
   * Configure the canvas paramters correctly
   */
  configureCanvas() {
    const { tileset } = this.config.map;
    const canvasWidth = tileset.tile.width * (1 + this.config.map.viewport.x);
    const canvasHeight = tileset.tile.height * (1 + this.config.map.viewport.y);

    // Make sure canvas is set accordingly
    this.canvas.setAttribute('width', canvasWidth);
    this.canvas.setAttribute('height', canvasHeight);

    // Do not smooth any pixels painted on
    this.context.imageSmoothingEnabled = false;
  }

  /**
   * Paint the map based on player's position
   */
  drawMap() {
    const { x, y } = this.player;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const {
      tileset, size, viewport, objects,
    } = this.config.map;

    const divider = {
      background: tileset.width / tileset.tile.width,
      foreground: objects.width / tileset.tile.width,
    };

    const tileCrop = {
      x: x - Math.floor(0.5 * viewport.x),
      y: y - Math.floor(0.5 * viewport.y),
    };

    // Drawing the map row by column.
    for (let column = 0; column <= viewport.y; column += 1) {
      for (let row = 0; row <= viewport.x; row += 1) {
        const tileToFind = (((column + tileCrop.y) * size.x) + row) + tileCrop.x;
        const backgroundTile = this.background[tileToFind] - 1;
        const foregroundTile = (this.foreground[tileToFind] - 1) - 252;

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
    }
  }

  /**
   * Draw dropped items on the map
   */
  drawItems() {
    // Filter out NPCs in viewport
    const nearbyItems = this.droppedItems.filter((item) => {
      const foundItems = (this.player.x <= (8 + item.x))
        && (this.player.x >= (item.x - 8))
        && (this.player.y <= (6 + item.y))
        && (this.player.y >= (item.y - 6));
      return foundItems;
    });

    // Get relative X,Y coordinates to paint on viewport
    nearbyItems.forEach((item) => {
      const viewport = {
        x: Math.floor(this.config.map.viewport.x / 2) - (this.player.x - item.x),
        y: Math.floor(this.config.map.viewport.y / 2) - (this.player.y - item.y),
      };

      // Get item information and get proper quantity index for graphic
      const info = UI.getItemData(item.id);
      let qtyIndex = 0;
      if (item.qty > 1 && info.graphics.quantityLevel) {
        const qLevels = info.graphics.quantityLevel;
        while (qtyIndex < qLevels.length - 1 && qLevels[qtyIndex] < item.qty) {
          qtyIndex += 1;
        }
      }

      // Get the correct tileset to draw upon
      const itemTileset = () => {
        switch (info.graphics.tileset) {
        case 'general':
          return this.images.generalImage;
        case 'jewelry':
          return this.images.jewelryImage;
        case 'armor':
          return this.images.armorImage;
        default:
        case 'weapons':
          return this.images.weaponsImage;
        }
      };

      // Paint the item on map
      this.context.drawImage(
        itemTileset(),
        ((info.graphics.column + qtyIndex) * 32), // Number in Item tileset
        (info.graphics.row * 32), // Y-axis of tileset
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
   * Draw the other players on the screen
   */
  drawPlayers() {
    // Filter out nearby players
    const nearbyPlayers = this.players.filter((player) => {
      const foundPlayers = (this.player.x <= (8 + player.x))
        && (this.player.x >= (player.x - 8))
        && (this.player.y <= (6 + player.y))
        && (this.player.y >= (player.y - 6));

      return foundPlayers;
    });

    // Get relative X,Y coordinates to paint on viewport
    nearbyPlayers.forEach((player) => {
      const viewport = {
        x: Math.floor(this.config.map.viewport.x / 2) - (this.player.x - player.x),
        y: Math.floor(this.config.map.viewport.y / 2) - (this.player.y - player.y),
      };

      // Paint the Player on map
      this.context.drawImage(
        this.images.playerImage,
        0, // Number in NPC tileset
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
    if (tile.foreground > -1) {
      isWalkable = UI.tileWalkable(tile.foreground, 'foreground');
    }

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
}

export default Map;

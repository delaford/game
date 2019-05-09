import bus from './utilities/bus';

class Engine {
  constructor(game) {
    this.game = game;

    // Frames per Second
    this.fps = {
      main: 0,
      max: 20,
      lastUpdate: 0,
    };

    // Frame on canvas painted
    this.frame = {
      limit: 300,
      lastTimeMS: 0,
      thisSecond: 0,
      update: 0,
    };

    // Bind context to same method as
    // we will be calling it out-of-context
    this.loop = this.loop.bind(this);

    bus.$on('SETTINGS:FPS', s => this.change('fps', s));
  }

  change(setting, val) {
    switch (setting) {
    case 'fps':
      this.fps.max = val;
      break;

    default:
      break;
    }
  }

  /**
   * The main game loop
   *
   * @param {decimal} timestamp The timestamp of when last called
   */
  loop(timestamp) {
    // Throttle the frame rate.
    if (timestamp < this.frame.lastTimeMS + (1000 / this.fps.max)) {
      requestAnimationFrame(this.loop);
      return;
    }

    // Note that the loop ran
    this.frame.lastTimeMS = timestamp;

    // Update every second
    if (timestamp > this.frame.update + 1000) {
      // Compute the new FPS
      this.fps.main = (0.25 * this.frame.thisSecond) + (0.75 * this.fps.main);

      this.frame.update = timestamp;
      this.frame.thisSecond = 0;
    }

    // Saving the data
    this.frame.thisSecond += 1;
    this.lastFrame = Date.now();

    // Paint the map
    this.paintCanvas();

    // and back to the top...
    requestAnimationFrame(this.loop);
  }

  /**
   * Kicks off the main game loop
   */
  start() {
    this.loop();
  }

  /**
   * Draw the new game map
   */
  paintCanvas() {
    // Draw the tile map
    this.game.map.drawMap();

    // Draw dropped items
    this.game.map.drawItems();

    // Draw the NPCs
    this.game.map.drawNPCs();

    // Draw other players
    this.game.map.drawPlayers();

    // Draw the player
    this.game.map.drawPlayer();

    // Draw the mouse selection
    this.game.map.drawMouse();
  }
}

export default Engine;

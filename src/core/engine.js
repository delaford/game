import UI from '../core/utilities/ui';
import bus from '../core/utilities/bus';

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

  /**
   * Handle NPC movement on map
   */
  npcMovement() {
    this.game.npcs.map((npc) => {
      // Next movement allowed in 2.5 seconds
      const nextActionAllowed = npc.lastAction + 2500;

      if (npc.lastAction === 0 || nextActionAllowed < Date.now()) {
        // Are they going to move or sit still this time?
        const action = UI.getRandomInt(1, 2) === 1 ? 'move' : 'nothing';

        // NPCs going to move during this loop?
        if (action === 'move') {
          // Which way?
          const direction = ['up', 'down', 'left', 'right'];
          const going = direction[UI.getRandomInt(0, 3)];

          // What tile will they be stepping on?
          const tileID = UI.getFutureTileID(this.game.map.background, npc.x, npc.y, going);

          switch (going) {
            default:
            case 'up':
              if ((npc.y - 1) >= (npc.spawn.y - npc.range)) {
                if (UI.tileWalkable(tileID)) {
                  npc.y -= 1;
                }
              }
              break;
            case 'down':
              if ((npc.y + 1) <= (npc.spawn.y + npc.range)) {
                if (UI.tileWalkable(tileID)) {
                  npc.y += 1;
                }
              }
              break;
            case 'left':
              if ((npc.x - 1) >= (npc.spawn.x - npc.range)) {
                if (UI.tileWalkable(tileID)) {
                  npc.x -= 1;
                }
              }
              break;
            case 'right':
              if ((npc.x + 1) <= (npc.spawn.x + npc.range)) {
                if (UI.tileWalkable(tileID)) {
                  npc.x += 1;
                }
              }
              break;
          }
        }

        // Register their last action
        npc.lastAction = Date.now();
      }

      return npc;
    });
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

    // Manage NPC movement
    if (this.game.npcs) {
      this.npcMovement();
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

    // Draw the NPCs
    this.game.map.drawNPCs();

    // Draw the player
    this.game.map.drawPlayer();

    // Draw the mouse selection
    this.game.map.drawMouse();
  }
}

export default Engine;

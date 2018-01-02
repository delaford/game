import config from './config';
import UI from './utilities/ui';
import bus from '../core/utilities/bus';

class Player {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.moving = false;

    console.log(`Player spawned at ${this.x}, ${this.y}`);
  }

  /**
   * Move the player in a direction per a tile
   *
   * @param {string} direction The direction which the player is moving
   * @param {object} map The map method associated with player
   * @param {boolean} pathfind Whether pathfinding is being used to move player
   */
  move(direction, map, pathfind = false) {
    if (pathfind) {
      this.moving = true;
    }

    switch (direction) {
      default:
        console.log('Nothing happened');
        break;

      case 'right':
        if (!this.checkCollision(map, direction)) {
          this.x += 1;
        }
        break;

      case 'left':
        if (!this.checkCollision(map, direction)) {
          this.x -= 1;
        }
        break;

      case 'up':
        if (!this.checkCollision(map, direction)) {
          this.y -= 1;
        }
        break;

      case 'down':
        if (!this.checkCollision(map, direction)) {
          this.y += 1;
        }
        break;
    }

    map.drawMap();
    map.drawPlayer();
  }

  /**
   * Initiates the walking of the path for the player
   *
   * @param {object} path The information to be used of the pathfind
   * @param {object} map The map object associated with player
   * @returns {function} An IIFE to start the walk
   */
  walkPath(path, map) {
    return ((stepsToTake) => {
      // Immediately-invoked function expression (IIFE) for the setTimeout
      // so that the setTimeouts queue up and do not mix with each other
      setTimeout(() => {
        // The X,Y coords of the last step we clicked on to walk
        // The X,Y coords of the last step during the walk-loop
        // (this lets us now if our route changed based on x,y coords)
        const onStep = {
          last: path.path.set[path.path.set.length - 1],
          loop: map.path.current.path.walking[map.path.current.path.walking.length - 1],
        };

        console.log('Path UID:', path.name, '- Step', (path.step + 1), '/', (path.length - 1));
        if (!onStep.loop || onStep.last === onStep.loop) {
          // If equal, it means our last step is the same as from
          // when our pathfinding first started, so we keep going.

          const activePath = path;
          // eslint-disable-next-line
          if (JSON.stringify(activePath.path.set) !== JSON.stringify(map.path.current.path.walking)) {
            bus.$emit('MAP:SET_PATH', activePath);
          }

          const steps = {
            current: {
              x: activePath.path.walking[0][0],
              y: activePath.path.walking[0][1],
            },
            next: {
              x: activePath.path.walking[1] ? activePath.path.walking[1][0] : null,
              y: activePath.path.walking[1] ? activePath.path.walking[1][1] : null,
            },
          };

          if (steps.next.x !== null) {
            // Move the player whichever direction
            this.move(UI.getMovementDirection(steps), map, true);
            activePath.step += 1;
          }

          // If we have steps left to take...
          // eslint-disable-next-line
          if (--stepsToTake) {
            this.walkPath(activePath, map, name);
            activePath.path.walking.shift();
          } else {
            // We are done walking
            // so let's reset path
            this.stopMovement();
          }
        } else {
          this.stopMovement();
          console.log('We have detected you changing routes while walking!');
        }
      }, 150);
    })((map.path.current.path.set.length - 1));
  }

  /**
   * When player stops moving during pathfinding walking
   */
  stopMovement() {
    this.moving = false;
    bus.$emit('PLAYER:STOP_MOVEMENT');
  }

  /**
   * Checks to see if player can continue walking
   *
   * @param map {object} The map object being passed
   * @param direction {string} The direction player is going
   * @returns {boolean} Checks if tile is on blocked array list
   */
  checkCollision(map, direction) {
    const { size, viewport, tileset } = config.map;
    const tileCrop = {
      x: this.x - Math.floor(0.5 * viewport.x),
      y: this.y - Math.floor(0.5 * viewport.y),
    };

    const getY = (dirMove) => {
      if (dirMove === 'right' || dirMove === 'left') return 5;
      return dirMove === 'up' ? 4 : 6;
    };

    const getX = (dirMove) => {
      if (dirMove === 'up' || dirMove === 'down') return 7;
      return dirMove === 'left' ? 6 : 8;
    };

    // eslint-disable-next-line
    const steppedOn = map.board[(((getY(direction) + tileCrop.y) * size.x) + getX(direction)) + tileCrop.x] - 1;

    return tileset.blocked.includes(steppedOn);
  }
}

export default Player;

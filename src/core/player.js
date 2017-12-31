import config from './config';
import UI from './utilities/ui';
import bus from '../core/utilities/bus';

class Player {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.moving = false;
    this.surface_level = 1;

    this.server = 'us-1';

    console.log(`[${this.server}] Player spawned at ${this.x}, ${this.y}`);
  }

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

  walkPath(path, map, name) {
    const speed = 250;

    const onStep = {
      last: path.path[path.path.length - 1],
      loop: map.path.current.walking[map.path.current.walking.length - 1],
    };

    (() => {
      setTimeout(() => {
        if (!onStep.loop || JSON.stringify(onStep.last) === JSON.stringify(onStep.loop)) {
          // If equal, it means our last step is the same as from
          // when our pathfinding first started, so we keep going.

          const activePath = path;
          if (JSON.stringify(activePath.path) !== JSON.stringify(map.path.current.walking)) {
            bus.$emit('MAP:SET_PATH', activePath);
          }

          const steps = {
            current: {
              x: activePath.path[0][0],
              y: activePath.path[0][1],
            },
            next: {
              x: activePath.path[1][0],
              y: activePath.path[1][1],
            },
          };

          activePath.step += 1;

          console.log(name, activePath.step);

          this.move(UI.getMovementDirection(steps), map, true);

          if ((activePath.step + 1) < activePath.length) {
            this.walkPath(activePath, map, name);
            activePath.path.shift();
          } else {
            this.stopMovement();
          }
        } else {
          debugger;
        }
      }, speed);
    })(window);
  }

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

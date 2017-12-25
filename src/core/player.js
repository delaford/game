import config from './config';

class Player {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.surface_level = 1;

    this.server = 'us-1';

    console.log(`[${this.server}] Spawned at ${this.x}, ${this.y}`);
  }

  move(direction, map) {
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
    map.drawMap(this.x, this.y);
    map.drawPlayer();
  }

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

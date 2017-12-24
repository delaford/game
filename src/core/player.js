// import config from './config';

class Player {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.surface_level = 1;

    this.server = 'us-1';

    console.log(`Spawned at ${this.x}, ${this.y}`);
  }

  move(direction, map) {
    switch (direction) {
      default:
        console.log('Nothing happened');
        break;

      case 'right':
        this.x += 1;
        break;

      case 'left':
        this.x -= 1;
        break;

      case 'up':
        this.y -= 1;
        break;

      case 'down':
        this.y += 1;
        break;

    }
    map.drawMap(this.x, this.y);
    map.drawPlayer();
  }
}

export default Player;

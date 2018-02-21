const config = require('./config');
const PF = require('pathfinding');
const emoji = require('node-emoji');
const world = require('./world');
const WebSocket = require('ws');
const UI = require('./utilities/ui');
const axios = require('axios');
const Socket = require('../socket');

class Player {
  constructor(data, token, socketId) {
    // Main statistics
    this.username = data.username;
    this.x = data.x;
    this.y = data.y;
    this.level = data.level;
    this.skills = data.skills;
    this.hp = {
      current: data.hp.current,
      max: data.hp.max,
    };

    // Authentication
    this.moving = false;
    this.token = token;
    this.uuid = data.uuid;
    this.socket_id = socketId;

    // Tabs
    this.friend_list = data.friend_list;
    this.wear = data.wear;

    // Pathfinding
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

    console.log(`${emoji.get('high_brightness')}  Player ${this.username} (lvl ${this.level}) logged in. (${this.x}, ${this.y})`);
  }

  /**
   * Move the player in a direction per a tile
   *
   * @param {string} direction The direction which the player is moving
   * @param {object} map The map method associated with player
   * @param {boolean} pathfind Whether pathfinding is being used to move player
   */
  move(direction, pathfind = false) {
    if (pathfind) {
      this.moving = true;
    }

    switch (direction) {
      default:
        console.log('Nothing happened');
        break;

      case 'right':
        if (!this.checkCollision(direction)) {
          this.x += 1;
        }
        break;

      case 'left':
        if (!this.checkCollision(direction)) {
          this.x -= 1;
        }
        break;

      case 'up':
        if (!this.checkCollision(direction)) {
          this.y -= 1;
        }
        break;

      case 'down':
        if (!this.checkCollision(direction)) {
          this.y += 1;
        }
        break;
    }
  }

  /**
   * Walk the player after a path is found
   *
   * @param {object} path The information to be used of the pathfind
   * @param {object} map The map object associated with player
   */
  walkPath(playerIndex) {
    const path = world.players[playerIndex].path;
    const speed = 150; // Delay to next step during walk

    // Immediately-invoked function expression (IIFE) for the setTimeout
    // so that the setTimeouts queue up and do not mix with each other
    (() => {
      setTimeout(() => {
        // If equal, it means our last step is the same as from
        // when our pathfinding first started, so we keep going.

        if ((path.current.step + 1) === path.current.path.walking.length) {
          this.stopMovement();
        } else {
          const steps = {
            current: {
              x: path.current.path.walking[path.current.step][0],
              y: path.current.path.walking[path.current.step][1],
            },
            next: {
              x: path.current.path.walking[path.current.step + 1][0],
              y: path.current.path.walking[path.current.step + 1][1],
            },
          };

          const movement = UI.getMovementDirection(steps);

          this.move(movement, true);

          const playerChanging = world.players[playerIndex];
          world.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              if (world.bus) {
                Socket.broadcast('player:movement', playerChanging);
              }
            }
          });

          world.players[playerIndex].path.current.step += 1;

          if (path.current.step <= path.current.path.walking.length) {
            this.walkPath(playerIndex);
          }
        }
      }, speed);
    })();
  }

  /**
   * When player stops moving during pathfinding walking
   */
  stopMovement() {
    this.moving = false;
    // bus.$emit('PLAYER:STOP_MOVEMENT');
  }

  /**
   * Checks to see if player can continue walking
   *
   * @param map {object} The map object being passed
   * @param direction {string} The direction player is going
   * @returns {boolean}
   */
  checkCollision(direction) {
    const { size, viewport, tileset, objects } = config.map;
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

    const steppedOn = {
      // eslint-disable-next-line
      background: world.map.background[(((getY(direction) + tileCrop.y) * size.x) + getX(direction)) + tileCrop.x] - 1,
      // eslint-disable-next-line
      foreground: world.map.foreground[(((getY(direction) + tileCrop.y) * size.x) + getX(direction)) + tileCrop.x] - 1,
    };

    // eslint-disable-next-line
    const blocked = {
      background: tileset.blocked.includes(steppedOn.background),
      foreground: objects.blocked.includes((steppedOn.foreground - 252)),
    };

    return blocked.background || blocked.foreground;
  }

  /**
   * Player will perform an action
   *
   * @param {string} item Action to do
   */
  do(item) {
    console.log(this.x, this.y, `Doing ${item}`);
  }

  update() {
    const url = `${process.env.SITE_URL}/api/auth/update`;
    const reqConfig = {
      headers: { Authorization: `Bearer ${this.token}` },
    };

    let getPlayer = world.players
      .find(p => p.token === this.token);

    getPlayer = {
      x: getPlayer.x,
      y: getPlayer.y,
      username: getPlayer.username,
      hp_current: getPlayer.hp.current,
      hp_max: getPlayer.hp.max,
    };

    const data = { uuid: this.uuid, data: getPlayer };

    return new Promise((resolve) => {
      axios
        .post(url, data, reqConfig)
        .then((r) => {
          resolve(r.data);
        });
    });
  }
}

module.exports = Player;

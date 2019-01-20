import uuid from 'uuid/v4';
import world from '../core/world';
import Socket from './../socket';

class Item {
  constructor(data) {
    this.id = data.id;
    this.uuid = uuid();
    this.name = data.name;
    this.examine = data.examine;
    this.price = data.price;
    this.type = data.type;
    this.graphics = data.graphics;
    this.wearable = data.wearable || false;

    // (Load up new weapons constructor)
    this.user = data.user;
    this.carried = data.carried;
    this.slot = data.slot;
    this.equipped = data.equipped;
  }

  /**
   * Checks the map for any picked up respawning items
   */
  static check() {
    const itemsWaitingToRespawn = world.respawns.items.filter(i => i.pickedUp);

    if (itemsWaitingToRespawn.length) {
      itemsWaitingToRespawn.forEach((item) => {
        if (Item.itemAlreadyPlaced(item) === undefined) {
          world.items.push({
            id: item.id,
            uuid: uuid(),
            x: item.x,
            y: item.y,
            respawn: true,
            timestamp: Date.now(),
          });

          Socket.broadcast('world:itemDropped', world.items);

          console.log(`${item.id} is respawning...`);
        }
      });
    }
  }

  /**
   * Is the item already placed in the map waiting to be picked up?
   *
   * @param {object} item The item we are checking
   *
   * @returns {boolean}
   */
  static itemAlreadyPlaced(item) {
    const time = new Date();

    return time > item.willRespawnIn
      && world.items.find(i => i.respawn && i.x === item.x && i.y === item.y);
  }

  /**
   * Take a string like '4hr 5m 1s' and get the numerical values
   *
   * @param {string} time The time for the time to respwan in
   * @param {string} part The part of time we are parsing
   *
   * @returns {integer}
   */
  static parseTime(time, part) {
    const found = time.split(' ').filter(t => t.endsWith(part)).map(t => Number(t.slice(0, -1)));
    if (found.length) {
      return found[0];
    }

    return false;
  }
}

module.exports = Item;

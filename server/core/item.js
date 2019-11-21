import { addHours, addMinutes, addSeconds } from 'date-fns';

import Socket from '@server/socket';
import uuid from 'uuid/v4';
import world from './world';

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
   * Check the map resources to see if they need to be replenished
   */
  static resourcesCheck() {
    world.respawns.resources.forEach((item, index) => {
      if (Item.itemAlreadyPlaced(item) === undefined) {
        // Set resource back to original tile
        world.map.foreground[item.onTile] = item.setToTile;

        // Tell all players of map update
        Socket.broadcast('world:foreground:update', world.map.foreground);

        // Take resource off respawn check
        world.respawns.resources.splice(index, 1);
      }
    });
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

  /**
   * Calculate the time it will take to respawn this tile
   *
   * @param {string} respawnTime Time in short notation (eg: '1hr 4m 18s')
   * @returns {integer}
   */
  static calculateRespawnTime(respawnTime) {
    // MOVE TO OBJECT ENGINE CLASS AND EXTEND FROM HERE?
    const pickedUpAt = new Date();
    const respawnsIn = respawnTime;

    const add = {
      hours: Item.parseTime(respawnsIn, 'h'),
      minutes: Item.parseTime(respawnsIn, 'm'),
      seconds: Item.parseTime(respawnsIn, 's'),
    };

    let timeToAdd = 0;
    if (typeof (add.hours) === 'number') timeToAdd = addHours(pickedUpAt, add.hours);
    if (typeof (add.minutes) === 'number') timeToAdd = addMinutes(pickedUpAt, add.minutes);
    if (typeof (add.seconds) === 'number') timeToAdd = addSeconds(pickedUpAt, add.seconds);

    return timeToAdd;
  }
}

export default Item;

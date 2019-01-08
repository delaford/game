import uuid from 'uuid/v4';
import world from '../core/world';
import { addSeconds } from 'date-fns';
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

  static check() {
    const itemsWaitingToRespawn = world.respawns.items.filter(i => i.pickedUp);


    if (itemsWaitingToRespawn.length) {
      const timeNow = new Date();
      itemsWaitingToRespawn.forEach((item, index) => {
        // If time is elapsed and is pickedUp...
        // Then let us put a new item back in-game
        if (timeNow > item.willRespawnIn) {
          debugger;
          world.respawns.items[index].willRespawnIn = addSeconds(timeNow, 3);

          world.items.push({
            id: item.id,
            uuid: uuid(),
            x: item.x,
            y: item.y,
            timestamp: Date.now(),
          });

          Socket.broadcast('world:itemDropped', world.items);

          console.log(`${item.id} is respawning...`);
        }
      });
    }
  }
}

module.exports = Item;

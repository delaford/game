const Map = require('../core/map');
const npcs = require('./../entities/npcs');
const items = require('./../entities/items');

class Assets {
  static async loadData(bus) {
    console.log('[SERVER] Loading data...');

    const block = {
      map: await Map.load(),
      npcs,
      items,
    };

    // // Create NPCs
    // npcs.forEach(npc => block.npcs.push(new NPC(npc)), this);

    // // Create items
    // items.forEach(item => this.items.push(new Item(item)), this);

    bus.emit('client:send-data', block);
  }
}

module.exports = Assets;

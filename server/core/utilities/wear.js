const { wearableItems } = require('../../data/items');
const world = require('../../core/world');

class Wear {
  /**
   * Get the attack value from this item
   *
   * @param {object} item The item being assessed
   * @returns {integer}
   */
  static getAttack(item) {
    const fullItem = wearableItems.find(i => i.id === item.id);
    return fullItem.stats.attack;
  }

  /**
   * Get the defense value from this item
   *
   * @param {object} item The item being assessed
   * @returns {integer}
   */
  static getDefense(item) {
    const fullItem = wearableItems.find(i => i.id === item.id);
    return fullItem.stats.defense;
  }

  /**
   * Update a player's combat attack and defense
   */
  static updateAttDef(playerIndex) {
    const stats = { att: 0, def: 0 };

    // Go through each wear item and add up its value
    Object.keys(world.players[playerIndex].wear).forEach((key) => {
      const val = world.players[playerIndex].wear[key];
      if (val !== null && val.uuid && val.id) {
        stats.att += this.getAttack({ id: val.id });
        stats.def += this.getDefense({ id: val.id });
      }
    });

    // Set new updated attack and defense values
    world.players[playerIndex].combat = {
      attack: stats.att,
      defense: stats.def,
    };
  }
}

module.exports = Wear;

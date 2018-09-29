const items = require('../../data/items');
const world = require('../../core/world');

class Wear {
  /**
   * Get the attack value from this item
   *
   * @param {object} item The item being assessed
   * @returns {integer}
   */
  static getAttack(item) {
    const fullItem = items.find(i => i.id === item.itemID);
    return fullItem.stats.attack;
  }

  /**
   * Get the defense value from this item
   *
   * @param {object} item The item being assessed
   * @returns {integer}
   */
  static getDefense(item) {
    const fullItem = items.find(i => i.id === item.itemID);
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
      if (val !== null && val.itemID) {
        stats.att += this.getAttack({ itemID: val.itemID });
        stats.def += this.getDefense({ itemID: val.itemID });
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

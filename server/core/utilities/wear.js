import world from '@server/core/world';
import { wearableItems } from '../data/items';

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
  static updateCombat(playerIndex) {
    const stats = {
      attack: {
        stab: 0,
        slash: 0,
        crush: 0,
        range: 0,
      },
      defense: {
        stab: 0,
        slash: 0,
        crush: 0,
        range: 0,
      },
    };

    // Go through each wear item and add up its value
    Object.keys(world.players[playerIndex].wear).forEach((key) => {
      const val = world.players[playerIndex].wear[key];
      if (val !== null && val.uuid && val.id) {
        const {
          crush,
          range,
          slash,
          stab,
        } = this.getAttack({ id: val.id });

        const {
          crush: defCrush,
          range: defRange,
          slash: defSlash,
          stab: defStab,
        } = this.getDefense({ id: val.id });

        // Update attack stats
        stats.attack.stab += stab;
        stats.attack.slash += slash;
        stats.attack.crush += crush;
        stats.attack.range += range;

        // Update defense stats
        stats.defense.stab += defStab;
        stats.defense.slash += defSlash;
        stats.defense.crush += defCrush;
        stats.defense.range += defRange;
      }
    });

    return stats;
  }
}

module.exports = Wear;

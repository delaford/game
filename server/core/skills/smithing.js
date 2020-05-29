import world from '@server/core/world';
import Skill from './index';

export default class Smithing extends Skill {
  constructor(playerIndex, resourceId, type) {
    super(playerIndex);
    this.player = world.players[playerIndex];
    this.resourceId = resourceId;
    this.type = type; // bar | ore
    this.columnId = 'smithing';

    this.inventory = this.player.inventory;
  }

  static ores() {
    return {
      'bronze-bar': {
        requires: {
          'tin-ore': 1,
          'copper-ore': 1,
        },
        experience: 6,
      },
      'iron-bar': {
        requires: {
          'iron-ore': 1,
        },
        experience: 13,
      },
    };
  }

  smelt(inventory) {
    console.log('Smelting', this.resourceId);

    const barToSmelt = Smithing.ores()[this.resourceId];

    const hasEnoughOre = () => {
      for (const ore of Object.keys(barToSmelt.requires)) {
        const oreFound = inventory.filter(inv => inv.id === ore);
        if (barToSmelt.requires[ore] > oreFound.length) { return false; }
      }

      return true;
    };

    if (hasEnoughOre) {
      // Let's take away the needed ores from inventory
      for (const ore of Object.keys(barToSmelt.requires)) {
        for (let i = 0; i < barToSmelt.requires[ore]; i + 1) {
          // Going through every ore requirement, getting the value
          // and filtering the ore needed one by one.
          // There's probably a better way to do this...
          const getIndexOfOre = this.inventory.findIndex(inv => inv.id === ore);
          this.inventory.splice(getIndexOfOre, 1);
        }
      }

      // Add bar to inventory
      // WORLD PLAYER ADD BAR TO INVENTORY (inventory.add() from Player)
      // AND RETURN THEIR NEW INVENTORY
    } else {
      console.log('Not enough ore.');
    }
  }

  static bars() {
    // The bars available to smith and their level needed.
    // Is this better suited in a config file?
    return {
      'bronze-bar': 1,
      'iron-bar': 19,
      'silver-bar': 25,
      'steel-bar': 40,
      'gold-bar': 47,
      'jatite-bar': 55,
    };
  }
}

import world from '@server/core/world';
import Skill from './index';

export default class Smithing extends Skill {
  constructor(playerIndex, ores) {
    super(playerIndex);
    this.player = world.players[playerIndex];
    this.ores = ores;
    this.columnId = 'smithing';
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

  static smelt(inventory, bar) {
    console.log('Smelting', bar);

    const barToSmelt = this.ores()[bar];

    const hasEnoughOre = () => {
      // eslint-disable-next-line
      for (const ore of Object.keys(barToSmelt.requires)) {
        const oreFound = inventory.filter(inv => inv.id === ore);
        if (barToSmelt.requires[ore] > oreFound.length) {
          return false;
        }
      }

      return true;
    };

    if (hasEnoughOre) {
      console.log('We have enough ore!');
    } else {
      console.log('Not enough ore.');
    }
  }

  static bars() {
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

import world from '@server/core/world';
import { smithing } from '@server/core/data/items';
import Socket from '@server/socket';

import Skill from './index';

export default class Smithing extends Skill {
  constructor(playerIndex, resourceId, type) {
    super(playerIndex);
    this.player = world.players[playerIndex];
    this.resourceId = resourceId;
    this.type = type; // bar | ore
    this.columnId = 'smithing';
    this.inventory = this.player.inventory.slots;
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
    const barToSmelt = Smithing.ores()[this.resourceId];

    const hasEnoughOre = () => {
      for (const ore of Object.keys(barToSmelt.requires)) {
        const oreFound = inventory.filter(inv => inv.id === ore);
        if (barToSmelt.requires[ore] > oreFound.length) { return false; }
      }

      return true;
    };

    return new Promise((resolve) => {
      if (hasEnoughOre()) {
        // Let's take away the needed ores from inventory
        const reqs = Object.keys(barToSmelt.requires);
        for (const ore of reqs) {
          for (let i = 0; i < barToSmelt.requires[ore]; i += 1) {
            // Going through every ore requirement, getting the value
            // and filtering the ore needed one by one.
            // There's probably a better way to do this...
            const getIndexOfOre = this.inventory.findIndex(inv => inv.id === ore);
            this.inventory.splice(getIndexOfOre, 1);
          }
        }

        world.players[this.playerIndex].inventory.slots = this.inventory;
        world.players[this.playerIndex].inventory.add(this.resourceId, 1);

        // Tell user of successful resource gathering
        const resource = smithing.find(i => i.id === this.resourceId);
        Socket.sendMessageToPlayer(this.playerIndex, `You successfully smelted a ${resource.name}.`);

        // Tell client of their new experience in that skill
        Socket.emit('resource:skills:update', {
          player: { socket_id: world.players[this.playerIndex].socket_id },
          data: world.players[this.playerIndex].skills,
        });


        Socket.emit('core:refresh:inventory', {
          player: { socket_id: world.players[this.playerIndex].socket_id },
          data: world.players[this.playerIndex].inventory.slots,
        });

        Socket.emit('core:pane:close', {
          player: { socket_id: world.players[this.playerIndex].socket_id },
        });

        resolve(resource);
      } else {
        console.log('Not enough ore.');
        Socket.sendMessageToPlayer(this.playerIndex, 'You do not have enough ore.');
      }
    });
  }

  static getItemsToSmith(bar) {
    if (bar === 'bronze-bar') {
      return [
        {
          item: 'bronze-dagger',
          level: 1,
          expGained: 12.5,
          bars: 1,
        },
        {
          item: 'bronze-axe',
          level: 1,
          expGained: 12.5,
          bars: 1,
        },
        {
          item: 'bronze-mace',
          level: 2,
          expGained: 12.5,
          bars: 1,
        },
        {
          item: 'bronze-med-helm',
          level: 3,
          expGained: 15,
          bars: 1,
        },
        {
          item: 'bronze-sword',
          level: 4,
          expGained: 25,
          bars: 2,
        },
      ];
    }

    return [];
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

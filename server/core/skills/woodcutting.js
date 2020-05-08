import Query from '@server/core/data/query';
import { foregroundObjects } from '@server/core/data/foreground';
import world from '@server/core/world';
import Skill from './index';

export default class Woodcutting extends Skill {
  constructor(playerIndex, treeId) {
    super(playerIndex);
    this.player = world.players[playerIndex];
    this.treeId = treeId;
    this.columnId = 'woodcutting';
  }

  get tree() {
    return foregroundObjects.find(e => e.id === this.treeId);
  }

  checkForAxe() {
    const axe = this.player.inventory.slots.find(i => i.id.includes('axe')) || this.player.wear.right_hand;
    if (!axe) return false;

    const itemFound = Query.getItemData(axe.id);

    return Woodcutting.isAnAxe(itemFound) ? itemFound : false;
  }

  static isAnAxe(item) {
    return item.actions.includes('chop') && item.id.includes('axe');
  }

  // TODO Add batching for the the tree.
  swingAtTree() {
    let counter = 0;
    console.log(`Chopping ${this.tree.resources}`);

    return new Promise((resolve, reject) => {
      if (this.tree.function === 'no-chopping-resource') {
        reject(new Error(this.tree.resource));
      } else if (this.checkForAxe()) {
        const action = setInterval(() => {
          counter += 1;
          console.log('Chopping at tree...');

          if (counter === 1) {
            clearInterval(action);
            resolve(this.tree);
          }
        }, 1000);
      } else {
        reject(new Error('You need an axe to chop trees.'));
      }
    });
  }
}

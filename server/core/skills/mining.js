import Skill from './index';
import { foregroundObjects } from '../data/foreground';

export default class Mining extends Skill {
  constructor(playerId, rockId) {
    super(playerId);
    this.rockId = rockId;
  }

  get rock() {
    return foregroundObjects.find(e => e.id === this.rockId);
  }

  /**
   * Swing your pickaxe at a rock to mine
   */
  pickAtRock() {
    let counter = 0;
    console.log(`Mining for ${this.rock.resources}`);

    const action = setInterval(() => {
      counter += 1;
      console.log('Picking at rock...');
      if (counter === 3) {
        clearInterval(action);
        console.log('Done.');
      }
    }, 1000);
  }

  /**
   * Inspect a rock to be told what it is
   */
  prospect() {
    const id = this.rock;
    console.log(id);

    // Get the ID of the rock
    // Return back the name of the rock via chat
  }
}

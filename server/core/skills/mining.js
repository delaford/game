import Skill from './index';

export default class Mining extends Skill {
  constructor(playerId, rock) {
    super(playerId);
    this.rock = rock;
  }

  pickAtRock() {
    console.log(`Mining for ${this.rock}`);
  }

  prospect() {
    const id = this.rock;
    console.log(id);

    // Get the ID of the rock
    // Return back the name of the rock via chat
  }
}

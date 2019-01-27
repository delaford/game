import world from '../world';

export default class Skill {
  constructor(playerIndex) {
    this.playerIndex = playerIndex;
  }

  updateExperience(skill, expToAdd) {
    console.log(`Updating experience for ${this.playerIndex}`);
    world.players[this.playerIndex].skills[skill].exp += expToAdd;
  }
}

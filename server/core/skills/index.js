import world from '../world';

export default class Skill {
  constructor(playerIndex) {
    this.playerIndex = playerIndex;
  }

  /**
   * Update a player's experience in a certain skill
   *
   * @param {integer} expToAdd The experience to add to current skill experience
   */
  updateExperience(expToAdd) {
    console.log(`Updating experience for ${this.tableId}`);
    world.players[this.playerIndex].skills[this.tableId].exp += expToAdd;
  }
}

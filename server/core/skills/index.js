import world from '../world';
import UI from 'shared/ui';
import Socket from '../../socket';

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
    const currentExperience = world.players[this.playerIndex].skills[this.columnId].exp;
    const updatedExperience = currentExperience + expToAdd;
    const didUserLevelUp = Skill.didUserLevelUp(currentExperience, updatedExperience);

    if (didUserLevelUp) {
      world.players[this.playerIndex].skills[this.columnId].level += 1;
      Socket.sendMessageToPlayer(this.playerIndex, `You have gained a ${UI.capitalizeFirstLetter(this.columnId)} level!`);
    }

    world.players[this.playerIndex].skills[this.columnId].exp = updatedExperience;
  }

  /**
   * Calculate whether a player has leveled up between experience gains
   *
   * @param {integer} currentExp The current experience points
   * @param {integer} updatedExp The updated experience points after action
   * @return {boolean}
   */
  static didUserLevelUp(currentExp, updatedExp) {
    const a = UI.getLevel(currentExp);
    const b = UI.getLevel(updatedExp);
    return a !== b;
  }
}

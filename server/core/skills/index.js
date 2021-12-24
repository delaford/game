import Socket from '@server/socket';
import UI from 'shared/ui';
import uuid from 'uuid/v4';
import world from '@server/core/world';

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

  /**
   * Tell the user to add resource to their inventory
   * or drop on ground based on inventory availability
   *
   * @param {object} getItem The resource we are gathering
   */
  extractResource(getItem) {
    const openSlot = UI.getOpenSlot(world.players[this.playerIndex].inventory.slots);

    // Do we have an open slot for the newly-mined resource?
    if (openSlot === false) {
      // If not, we let it fall on the ground
      world.items.push({
        id: getItem.id,
        uuid: uuid(),
        x: world.players[this.playerIndex].x,
        y: world.players[this.playerIndex].y,
        timestamp: Date.now(),
      });

      Socket.broadcast('world:itemDropped', world.items);
    } else {
      // If so, we add it to our inventory
      world.players[this.playerIndex].inventory.add(getItem.resources, 1);

      Socket.emit('core:refresh:inventory', {
        player: { socket_id: world.players[this.playerIndex].socket_id },
        data: world.players[this.playerIndex].inventory.slots,
      });
    }
  }
}

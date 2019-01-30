import UI from 'shared/ui';

const world = require('../../core/world');
const Socket = require('../../socket');
const { wearableItems } = require('./../../core/data/items');

module.exports = {
  /**
   * Equip an an item to the player
   *
   * @param {object} data Item you are equipping
   */
  equippedAnItem(data) {
    const equippingItem = data.player.inventory.find(s => s.slot === data.item.miscData.slot);
    const playerIndex = world.players.findIndex(p => p.uuid === data.id);
    const getItem = wearableItems.find(i => i.id === data.item.id);

    const item = {
      name: getItem.name,
      graphics: getItem.graphics,
      id: getItem.id,
      uuid: equippingItem.uuid,
    };

    world.players[playerIndex].wear[getItem.slot] = item;
    // eslint-disable-next-line
    const getRealPlacement = world.players[playerIndex].inventory.findIndex(i => item.uuid === i.uuid);
    world.players[playerIndex].inventory.splice(getRealPlacement, 1);

    Socket.broadcast('player:equippedAnItem', world.players[playerIndex]);
  },

  /**
   * Unequip an an item to the player
   *
   * @param {object} data Item you are unequipping
   */
  unequipItem(data) {
    return new Promise((resolve) => {
      const playerIndex = world.players.findIndex(p => p.uuid === data.id);
      const getItem = wearableItems.find(i => i.id === data.item.id);

      const item = {
        slot: UI.getOpenSlot(world.players[playerIndex].inventory),
        id: getItem.id,
        graphics: getItem.graphics,
        uuid: world.players[playerIndex].wear[getItem.slot].uuid,
      };

      // If we are replacing an item (because we are equipping while wielding)
      // and the slot from where the item was equipped is less than the first
      // slot available, then let us unequip to that slot.
      if (data.replacing && UI.isNumeric(item.slot) && item.slot >= data.item.slot) {
        item.slot = data.item.slot;
      }

      world.players[playerIndex].wear[getItem.slot] = null;
      world.players[playerIndex].inventory.push(item);

      Socket.broadcast('player:unequippedAnItem', world.players[playerIndex]);
      resolve(200);
    });
  },
};

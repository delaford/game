import Socket from '@server/socket';
import UI from 'shared/ui';
import { wearableItems } from '@server/core/data/items';
import world from '@server/core/world';
import Wear from '@server/core/utilities/wear';

export default {
  /**
   * Equip an an item to the player
   *
   * @param {object} data Item you are equipping
   */
  equippedAnItem(data) {
    const equippingItem = data.player.inventory.slots.find(s => s.slot === data.item.miscData.slot);
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
    const getRealPlacement = world.players[playerIndex].inventory.slots.findIndex(i => item.uuid === i.uuid);
    world.players[playerIndex].inventory.slots.splice(getRealPlacement, 1);

    world.players[playerIndex].combat = Wear.updateCombat(playerIndex);
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
        slot: UI.getOpenSlot(world.players[playerIndex].inventory.slots),
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

      world.players[playerIndex].inventory.add(
        getItem.id,
        1,
        world.players[playerIndex].wear[getItem.slot].uuid,
      );

      world.players[playerIndex].wear[getItem.slot] = null;

      world.players[playerIndex].combat = Wear.updateCombat(playerIndex, true);

      Socket.broadcast('player:unequippedAnItem', world.players[playerIndex]);
      resolve(200);
    });
  },
};

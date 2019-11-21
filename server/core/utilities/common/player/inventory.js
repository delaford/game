import Query from '@server/core/data/query';
import UI from 'shared/ui';
import uuid from 'uuid/v4';
import world from '@server/core/world';

export default class Inventory {
  constructor(slots, socketId) {
    this.slots = slots;
    this.socketId = socketId;
    this.playerIndex = world.players.findIndex(p => p.socket_id === this.socketId);
  }


  /**
   * Adds item to player's inventory
   *
   * @param {string} itemId - The ID of the item
   * @param {integer} qty - The number of quantity for that item
   */
  add(itemId, qty = 1, incomingUuid = null) {
    // TODO
    // Drop items on floor if no space (functionality in shop)
    return new Promise((resolve) => {
      const { stackable } = Query.getItemData(itemId);

      const rounds = stackable ? 1 : qty; // How many times to iterate on inventory?
      for (let index = 0; index < rounds; index += 1) {
        const itemUuid = incomingUuid || uuid();
        const itemToAdd = {
          id: itemId,
          uuid: itemUuid,
          slot: UI.getOpenSlot(this.slots),
        };

        // If the item is stackable, lets give its proper quantity
        if (stackable) {
          itemToAdd.qty = qty;
        }

        this.slots.push(itemToAdd);

        resolve(200);
      }
    });
  }
}

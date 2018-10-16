const world = require('../../core/world');
const Socket = require('../../socket');
const { wearableItems } = require('../../data/items');
const UI = require('./../../core/utilities/ui');
const Wear = require('./../../core/utilities/wear');

module.exports = {
  equippedAnItem(data) {
    const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
    const getItem = wearableItems.find(i => i.id === data.data.item.id);

    const item = {
      graphics: getItem.graphics,
      id: data.data.item.id,
      uuid: data.data.item.uuid,
    };

    world.players[playerIndex].wear[getItem.slot] = item;
    // eslint-disable-next-line
    const getRealPlacement = world.players[playerIndex].inventory.findIndex(i => item.uuid === i.uuid);
    world.players[playerIndex].inventory.splice(getRealPlacement, 1);

    Wear.updateAttDef(playerIndex);

    Socket.broadcast('player:equippedAnItem', world.players[playerIndex]);
  },
  unequipItem(data) {
    return new Promise((resolve) => {
      const playerIndex = world.players.findIndex(p => p.uuid === data.data.id);
      const getItem = wearableItems.find(i => i.id === data.data.item.id);

      const item = {
        slot: UI.getOpenSlot(world.players[playerIndex].inventory),
        id: getItem.id,
        uuid: world.players[playerIndex].wear[getItem.slot].uuid,
      };

      if (data.data.replacing) {
        // TODO - Make this nicer.
        item.slot = item.slot <= data.data.item.slot ? item.slot : data.data.item.slot;
      }

      console.log(`Unequip: ${getItem.id}`);

      world.players[playerIndex].wear[getItem.slot] = null;
      world.players[playerIndex].inventory.push(item);
      Wear.updateAttDef(playerIndex);
      Socket.broadcast('player:unequippedAnItem', world.players[playerIndex]);
      resolve(200);
    });
  },
};

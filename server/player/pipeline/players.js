import UI from 'shared/ui';

const world = require('../../core/world');
const Socket = require('../../socket');
const { wearableItems } = require('./../../core/data/items');

module.exports = {
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

    console.log(`Equip: ${getItem.id}`);

    Socket.broadcast('player:equippedAnItem', world.players[playerIndex]);
  },
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

      if (data.replacing) {
        // TODO - Make this nicer.
        item.slot = item.slot <= data.item.slot ? item.slot : data.item.slot;
      }
      console.log(`Unequip: ${getItem.id}`);

      world.players[playerIndex].wear[getItem.slot] = null;
      world.players[playerIndex].inventory.push(item);

      Socket.broadcast('player:unequippedAnItem', world.players[playerIndex]);
      resolve(200);
    });
  },
};

import world from '../world';

export default class Bank {
  constructor(uuid, itemId, quantity, type) {
    this.playerId = world.players.findIndex(p => p.uuid === uuid);
    this.inventory = world.players[this.playerId].inventory;
    this.itemId = itemId;
    this.quantity = quantity;
    this.type = type;
    this.bankSlots = world.players[this.playerId].bank;
  }
}

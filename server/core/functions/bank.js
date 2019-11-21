import Query from '@server/core/data/query';
import UI from 'shared/ui';
import config from '@server/config';
import world from '@server/core/world';

export default class Bank {
  constructor(playerUuid, itemId, quantity, type) {
    // Data references
    this.playerIndex = world.players.findIndex(p => p.uuid === playerUuid);
    this.inventory = world.players[this.playerIndex].inventory;
    this.bankSlots = world.players[this.playerIndex].bank;

    // Item we are withdrawing or depositing
    this.itemId = itemId;

    // Where in our inventory or bank can this item be?
    this.index = {
      inventory: this.inventory.slots.findIndex(e => e.id === this.itemId),
      bank: this.bankSlots.findIndex(e => e.id === this.itemId),
    };

    // Is the item we are acting upon a stackable item?
    this.stackable = Query.getItemData(itemId).stackable;

    // Are withdrawing or depositing? Change to source of items based on action
    this.source = (type === 'withdraw' ? this.bankSlots : this.inventory.slots);

    // The item we are acting on
    this.item = this.source.find(e => e.id === this.itemId);

    // The quantity we are withdrawing or depositing
    this.quantity = this.getTrueQuantity(quantity, type);
  }

  /**
   * Check for space in the correct array (inventory or bank)
   *
   * @param {string} type The type of action we are doing (withdraw|deposit)
   * @return {integer}
   */
  checkCorrectSpace(type) {
    const slotsAvailable = {
      inventory: (config.player.slots.inventory - this.inventory.slots.length),
      bank: (config.player.slots.bank - this.bankSlots.length),
    };

    return slotsAvailable[type === 'withdraw' ? 'inventory' : 'bank'];
  }

  /**
   * Get the real amount of quantity based on the level we choose
   *
   * @param {integer} quantity The number we are withdrawing or depositing
   * @param {string} type Are we doing a deposit or withdrawal?
   * @return {integer}
   */
  getTrueQuantity(quantity, type) {
    const getItem = this.source.filter(e => e.id === this.itemId);
    const itemFound = (type === 'withdraw' || this.stackable) ? getItem[0].qty : getItem.length;

    // First we get the number of available slots open in our inventory or bank
    const availableSlots = this.checkCorrectSpace(type);

    if (quantity === 'All') {
      // If we are withdrawing and its not stackable
      // then we want to see whats available in the inventory
      // but if we are depositing, all items have a QTY counter
      // and thus we can get the number of items we found
      return type === 'withdraw' && !this.stackable ? availableSlots : itemFound;
    }

    // If we have no slots available -- just return zero.
    if (availableSlots === 0) return 0;

    // Based on what we are enacting on,
    // we need to determine the correct quantity
    // we can deposit or withdraw
    const amount = this.stackable || type === 'deposit' ? itemFound : availableSlots;

    // If our quantity is more than we want to deposit/withdraw
    // set accordingly. Withdraw 5; only have 3? Withdraw 3.
    return quantity < amount ? quantity : amount;
  }

  /**
   * Does the inventory have enough space available?
   *
   * @return {boolean}
   */
  notEnoughSpace() {
    return this.quantity === 0;
  }

  /**
   * Is the item we are enacting on already in the bank?
   */
  itemAlreadyInBank() {
    return this.bankSlots.map(e => e.id).includes(this.itemId) === true;
  }

  /**
   * Is the item we are enacting on already in our inventory
   */
  itemAlreadyInInventory() {
    return this.inventory.slots.map(e => e.id).includes(this.itemId) === true;
  }

  /**
   * Withdraw an item from the bank
   */
  async withdraw() {
    if (this.notEnoughSpace()) {
      throw new Error('Not enough space to withdraw.');
    }

    // First, is the item we are withdrawing already in the inventory and stackable?
    if (this.itemAlreadyInInventory() && this.stackable) {
      // If so, lets just add to its quantity
      this.inventory.slots[this.index.inventory].qty += this.quantity;
    } else {
      // Add item to inventory either once (if stackable) or as many times as needed
      await this.inventory.add(this.itemId, this.quantity);
    }

    // Secondly, lets update our bank accordingly
    this.bankSlots[this.index.bank].qty -= this.quantity;
    // Check to see if our item quantity is still above zero no matter what
    if (this.item.qty === 0) {
      // If not, let us remove it from our source (inventory or bank)
      this.source.splice(this.source.findIndex(q => q.id === this.itemId), 1);
    }

    // Lastly, lets return our new inventory and bank
    return {
      inventory: this.inventory.slots,
      bankItems: this.bankSlots,
    };
  }

  /**
   * Deposit items in bank
   */
  deposit() {
    // First, are we depositing a stackable item?
    if (this.stackable) {
      // Let's remove its quantity accordingly
      this.inventory.slots[this.index.inventory].qty -= this.quantity;
    } else {
      // First we sort the items by their slot #
      // then we remove the first X (quantity)
      // then we add the remaining inventory
      const getItemInventory = this.inventory.slots
        .filter(i => i.id === this.itemId)
        .sort((a, b) => a.slot - b.slot)
        .splice(this.quantity);

      this.inventory.slots = [
        ...getItemInventory,
        ...this.inventory.slots
          .filter(i => i.id !== this.itemId),
      ];
    }

    // Check to see if our item quantity is still above zero (if stackable)
    if (this.stackable && this.item.qty === 0) {
      // If not, let us remove it from our source (inventory or bank)
      this.source.splice(this.source.findIndex(q => q.id === this.itemId), 1);
    }

    // Second, lets update our bank accordingly
    if (this.itemAlreadyInBank()) {
      // If item is already in the bank, let update its quantity
      this.bankSlots[this.index.bank].qty += this.quantity;
    } else {
      // If not, lets add it to our bank
      this.bankSlots.push({
        id: this.itemId,
        qty: this.quantity,
        slot: UI.getOpenSlot(this.bankSlots, 'bank'),
      });
    }

    // Lastly, lets return our new inventory and bank
    return {
      inventory: this.inventory.slots,
      bankItems: this.bankSlots,
    };
  }
}

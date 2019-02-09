import UI from 'shared/ui';
import uuid from 'uuid/v4';
import world from '../world';
import Query from '../data/query';
import config from '../../config';

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
      inventory: this.inventory.findIndex(e => e.id === this.itemId),
      bank: this.bankSlots.findIndex(e => e.id === this.itemId),
    };

    // Is the item we are acting upon a stackable item?
    this.stackable = Query.getItemData(itemId).stackable;

    // Are withdrawing or depositing? Change to source of items based on action
    this.source = (type === 'withdraw' ? this.bankSlots : this.inventory);

    // The item we are acting on
    this.item = this.source.find(e => e.id === this.itemId);

    // The quantity we are withdrawing or depositing
    this.quantity = this.getTrueQuantity(quantity, type);
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
    const inventorySlots = config.player.slots.inventory;
    const itemFound = (type === 'withdraw' || this.stackable) ? getItem[0].qty : getItem.length;

    if (quantity === 'All') {
      // We either get all of the quantity a stackable item has
      // or we get the number of times that item appears in the inventory
      let availableSlots = (inventorySlots - this.inventory.length);
      if (type === 'deposit') availableSlots = itemFound;
      return this.stackable ? this.item.qty : availableSlots;
    }

    // If our quantity is more than we want to deposit/withdraw
    // set accordingly. Withdraw 5; only have 3? Withdraw 3.
    return quantity > itemFound ? itemFound : quantity;
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
    return this.inventory.map(e => e.id).includes(this.itemId) === true;
  }

  /**
   * Withdraw an item from the bank
   */
  withdraw() {
    // First, is the item we are withdrawing already in the inventory and stackable?
    if (this.itemAlreadyInInventory() && this.stackable) {
      // If so, lets just add to its quantity
      this.inventory[this.index.inventory].qty += this.quantity;
    } else {
      // Add item to inventory either once (if stackable) or as many times as needed
      const rounds = this.stackable ? 1 : this.quantity; // How many times to iterate on inventory?
      for (let index = 0; index < rounds; index += 1) {
        const itemToAdd = {
          id: this.itemId,
          uuid: uuid(),
          slot: UI.getOpenSlot(this.inventory),
        };

        // If the item is stackable, lets give its proper quantity
        if (this.stackable) {
          itemToAdd.qty = this.quantity;
        }

        this.inventory.push(itemToAdd);
      }
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
      inventory: this.inventory,
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
      this.inventory[this.index.inventory].qty -= this.quantity;
    } else {
      // First we sort the items by their slot #
      // then we remove the first X (quantity)
      // then we add the remaining inventory
      const getItemInventory = this.inventory
        .filter(i => i.id === this.itemId)
        .sort((a, b) => a.slot - b.slot)
        .splice(this.quantity);

      this.inventory = [
        ...getItemInventory,
        ...this.inventory
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
      inventory: this.inventory,
      bankItems: this.bankSlots,
    };
  }
}

import Query from '@server/core/data/query';
import Socket from '@server/socket';
import UI from 'shared/ui';
import { player } from '@server/config';
import { shops } from '@server/core/data/foreground';
import world from '@server/core/world';

class Shop {
  constructor(shopId, playerUuid, itemId, type, quantity) {
    // Our player's reference and index
    this.playerIndex = world.players.findIndex(p => p.uuid === playerUuid);
    this.inventory = world.players[this.playerIndex].inventory;

    // How many spaces available in the player's inventory?
    this.slotsAvailable = player.slots.inventory - this.inventory.slots.length;

    // What item we are buying/selling?
    this.itemId = itemId;

    // Object index references
    this.shopIndex = world.shops.findIndex(i => i.npcId === shopId);
    this.shop = world.shops[this.shopIndex].inventory; // Shop's inventory
    this.coinIndex = this.inventory.slots.findIndex(e => e.id === 'coins');
    this.shopItemIndex = this.shop.findIndex(q => q.id === this.itemId);
    this.shopType = world.shops[this.shopIndex].type;

    // Is our item stackable?
    this.itemFull = Query.getItemData(this.itemId);
    this.stackable = this.itemFull.stackable;
    this.ableToBuyAll = false;

    // Is this item prohibited from being sold?
    this.prohibited = this.itemFull.prohibited;

    // Get the quantity of how much we are able to buy
    this.quantity = this.getTrueStockableQuantity(quantity);
    this.quantityToSell = this.getSellableQuantity(quantity);

    // Do we have enough space? Money?
    this.insufficient = {
      space: false,
      funds: false,
    };

    // Are buying or selling? Change to source of items based on action
    this.source = (type === 'buy' ? this.shop : this.inventory.slots);

    // The item we are acting on
    this.item = this.source.find(e => e.id === this.itemId);
  }

  /**
   * Load the store data
   *
   * @return {object}
   */
  static load() {
    return shops.map((s) => {
      // Format to more consise properties
      s.inventory = s.inventory.map(Shop.formatData);
      // Take stock of original items sold in general stores
      s.originalStock = s.inventory.map(q => q.id);
      return s;
    });
  }

  /**
   * How many items can we sell?
   *
   * @param {integer} quantity The quantity we are selling
   * @return {integer}
   */
  getSellableQuantity(quantity) {
    // How many items (to sell) do we have in our inventory?
    const howManyItems = this.inventory.slots.map(q => q.id).filter(e => e === this.itemId).length;

    // If our items exceed the quantity we want to
    // sell (50), set the correct amount to sell.
    return howManyItems > quantity ? quantity : howManyItems;
  }

  /**
   * Return the number of items we can buy based on the store's in-stock quantity
   *
   * @param {integer} quantity The number of items we want to buy from context-menu
   * @return {boolean}
   */
  getTrueStockableQuantity(quantity) {
    if (this.shopItemIndex === -1) return 0;
    // Is our in-stock quantity higher than what we want to buy?
    const moreThanWeHave = this.shop[this.shopItemIndex].qty >= quantity;

    // If not, we will be able to buy all (ig: in-stock = 10, buy 5)
    this.ableToBuyAll = moreThanWeHave === true;

    // If we want to buy more than we have, use the user-clicked
    // quantity otherwise lets buy the items in-stock quantity.
    return moreThanWeHave ? quantity : this.shop[this.shopItemIndex].qty;
  }

  /**
   * Return the true quantity of items we are buying based on
   * the number of slots availabe in player's inventory
   *
   * @return {integer}
   */
  getTrueBuyingQuantity() {
    // If we don't have enought slots available,
    // then we must substract from quantity to get true amount.
    const slotsLeftQuantity = this.slotsAvailable - this.quantity;
    if (slotsLeftQuantity < 0) {
      this.quantity = this.slotsAvailable;
      this.insufficient.space = true;
      return this.slotsAvailable;
    }

    // If our quantity wanted is less than slots available, return the quantity
    // otherwise, lets take the remaining slots left and just give them that.
    // (eg: player has 8 slots left, wants to buy 20, we return 12)
    return this.quantity <= this.slotsAvailable ? this.quantity : slotsLeftQuantity;
  }

  /**
   * Check to see if our item is in stock
   *
   * @return {boolean}
   */
  itemInStock() {
    if (this.shopItemIndex === -1) return false;
    if (!this.shop[this.shopItemIndex]) return false;

    return this.shop[this.shopItemIndex].qty > 0;
  }

  /**
   * Is this store a speciality type?
   * (Ludovicus's Axes, etc)
   *
   * @return {boolean}
   */
  isSpeciality() {
    return this.shopType === 'speciality';
  }

  /**
   * Is this store a general store?
   *
   * @return {boolean}
   */
  isGeneralStore() {
    return this.shopType === 'general';
  }

  /**
   * Can we sell this item based on inventory space, store requirements or anything else?
   *
   * @return {boolean}
   */
  canWeSell() {
    let willWeSell = false;
    let msg = '';
    if (this.prohibited) {
      willWeSell = false;
      msg = 'You cannot sell this item.';
    } else if (this.isSpeciality()) {
      willWeSell = this.shop.map(q => q.id).includes(this.itemId);
      if (!willWeSell) {
        msg = 'You cannot sell this item to the store.';
      } else if (!this.spaceInInventory()) {
        willWeSell = false;
        msg = 'Not enough space in inventory.';
      } else {
        willWeSell = true;
      }
    } else {
      willWeSell = true;
    }

    // If we can't, lets give them the reason why not
    if (!willWeSell) {
      Socket.emit('game:send:message', {
        player: { socket_id: world.players[this.playerIndex].socket_id },
        text: msg,
      });
    }

    return willWeSell;
  }

  /**
   * Sell an item to the shop
   */
  sell() {
    const { price } = Query.getItemData(this.itemId);

    if (this.canWeSell()) {
      const rounds = this.stackable ? 1 : this.quantityToSell;

      if (this.itemInStock() || this.buyingStoreProduct()) {
        this.shop[this.shopItemIndex].qty += this.quantityToSell;
      }

      if (!this.itemInStock() && this.isGeneralStore()) {
        this.shop.push({
          id: this.itemId,
          qty: this.quantityToSell,
          slot: UI.getOpenSlot(this.shop),
        });
      }

      // Remove item from inventory
      for (let index = 0; index < rounds; index += 1) {
        this.inventory.slots.splice(this.inventory.slots.findIndex(z => z.id === this.itemId), 1);
        this.coinIndex = this.inventory.slots.findIndex(e => e.id === 'coins'); // Update the index where coins are in inventory
      }

      // Add coins to our coins in inventory
      if (this.hasCoinsInInventory()) {
        this.inventory.slots[this.coinIndex].qty += price * rounds;
      } else {
        // If not, lets give them their coins to the inventory
        this.inventory.add('coins', price * rounds);
      }
    }

    return {
      inventory: this.inventory.slots,
      shopItems: this.shop,
    };
  }

  /**
   * Is the player buying a store-stocked item?
   *
   * @return {boolean}
   */
  buyingStoreProduct() {
    return world.shops[this.shopIndex].originalStock.includes(this.itemId);
  }

  /**
   * Buy an item from the shop
   */
  buy() {
    // Get price of item
    const { price } = Query.getItemData(this.itemId);
    // How many items can we buy based on inventory space
    const isBuying = this.getTrueBuyingQuantity();
    // How much gold are we spending?
    const toSpend = price * isBuying;
    // How much gold do we have?
    let playerGold = 0;

    if (this.inventory.slots[this.coinIndex]) {
      playerGold = this.inventory.slots[this.coinIndex].qty;
    }
    // How much money left after purchase?
    const moneyLeft = playerGold - toSpend;
    // How many items to buy based on all calculations
    let rounds = this.stackable ? 1 : this.quantity;

    // Do we have enough money?
    this.insufficient.funds = moneyLeft <= -1;
    // then we are not buying anything
    if (this.insufficient.funds) rounds = 0;

    // Add item to inventory
    this.inventory.add(this.itemId, rounds);

    // Save quantity before a purchase
    const qtyBeforePurchase = this.shop[this.shopItemIndex].qty;

    // If we completed one round of purchasing
    if (rounds > 0) {
      // Update our new money total
      if (moneyLeft > 0) {
        this.inventory.slots[this.coinIndex].qty = moneyLeft;
      } else {
      // A quantity of zero still renders the item sprite.
      // In the case that we have no money left, we should remove
      // the whole coin sprite from the inventory
        this.inventory.slots.splice(this.coinIndex, 1);
      }

      // Substract the quantity of the items we have bought
      const qtyAfterPurchase = this.shop[this.shopItemIndex].qty - isBuying;

      if (qtyAfterPurchase > 0 || this.buyingStoreProduct()) {
        this.shop[this.shopItemIndex].qty = qtyAfterPurchase;
      } else {
        // Remove sprite with quantity equals to zero only
        // when item's origin is from a player.
        this.shop.splice(this.shopItemIndex, 1);
      }
    }

    // Check to see if purchases can be
    // made and give message accordingly
    this.checkPurchase(qtyBeforePurchase);

    return {
      inventory: this.inventory.slots,
      shopItems: this.shop,
    };
  }

  /**
   * The purchase did not meet all requirements
   */
  checkPurchase(quantity) {
    let msg = '';
    if (quantity < 1 && this.buyingStoreProduct()) {
      msg = 'No more in stock.';
    } else if (this.insufficient.funds) {
      msg = 'Not enough gold to purchase.';
    } else if (this.insufficient.space) {
      msg = 'You were not able to buy all of the items.';
    }

    if (msg !== '') {
      Socket.emit('game:send:message', {
        player: { socket_id: world.players[this.playerIndex].socket_id },
        text: msg,
      });
    }
  }

  /**
   * Get the value for an item to player
   */
  value() {
    const { price, name } = Query.getItemData(this.itemId);
    Socket.emit('game:send:message', {
      player: { socket_id: world.players[this.playerIndex].socket_id },
      text: this.prohibited ? 'How can you value that which has infinite value?' : `${name}: ${price} coins.`,
    });
  }

  /**
   * Has the player succesffuly made a sale?
   *
   * @param {object} response The sale to be analyzed
   * @return {boolean}
   */
  static successfulSale(response) {
    return response !== undefined && Object.prototype.hasOwnProperty.call(response, 'inventory');
  }

  /**
   * Does the player have enough space in their inventory?
   *
   * @return {boolean}
   */
  spaceInInventory() {
    return this.hasCoinsInInventory() || this.slotsAvailable > 0;
  }

  /**
   * Does the player have coins in their inventory?
   *
   * @return {boolean}
   */
  hasCoinsInInventory() {
    return this.coinIndex > -1;
  }

  /**
   * Return the inventory data from the source to a common format for ItemGrid
   *
   * @param {object} data The shop data
   * @param {integer} i The iteration in the inventory
   * @return {object}
   */
  static formatData(data, i) {
    return {
      id: data.item,
      qty: data.stock,
      slot: i,
    };
  }
}

export default Shop;

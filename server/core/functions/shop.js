import uuid from 'uuid/v4';
import UI from 'shared/ui';
import world from '../world';
import Socket from '../../socket';
import Query from '../data/query';
import { player } from '../../config';
import { shops } from './../data/foreground';

class Shop {
  constructor(shopId, playerUuid, itemId, type, quantity) {
    // Our player's reference and index
    this.playerIndex = world.players.findIndex(p => p.uuid === playerUuid);
    this.inventory = world.players[this.playerIndex].inventory;

    // How many spaces available in the player's inventory?
    this.slotsAvailable = player.slots.inventory - this.inventory.length;

    // What item we are buying/selling?
    this.itemId = itemId;

    // Object index references
    this.shopIndex = world.shops.findIndex(i => i.npcId === shopId);
    this.shop = world.shops[this.shopIndex].inventory; // Shop's inventory
    this.coinIndex = this.inventory.findIndex(e => e.id === 'coins');
    this.shopItemIndex = this.shop.findIndex(q => q.id === this.itemId);

    // How much do we have left of the item we are trying to sell/buy in shop?
    this.shopItemQtyLeft = this.shop[this.shopItemIndex].qty;

    // Is our item stackable?
    this.stackable = Query.getItemData(q => q.id === this.itemId);
    this.ableToBuyAll = false;

    // Get the quantity of how much we are able to buy
    this.quantity = this.getTrueStockableQuantity(quantity);

    // Do we have enough space? Money?
    this.insufficient = {
      space: false,
      funds: false,
    };

    // Are buying or selling? Change to source of items based on action
    this.source = (type === 'buy' ? this.shop : this.inventory);

    // The item we are acting on
    this.item = this.source.find(e => e.id === this.itemId);
  }

  /**
   * Load the store data
   */
  static load() {
    return shops.map((s) => {
      s.inventory = s.inventory.map(Shop.formatData);
      return s;
    });
  }

  /**
   * Return the number of items we can buy based on the store's in-stock quantity
   *
   * @param {integer} quantity The number of items we want to buy from context-menu
   * @return {boolean}
   */
  getTrueStockableQuantity(quantity) {
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
    return this.quantity < this.slotsAvailable ? this.quantity : slotsLeftQuantity;
  }

  /**
   * Check to see if our item is in stock
   *
   * @return {boolean}
   */
  itemInStock() {
    if (this.shopItemQtyLeft === 0) {
      Socket.emit('game:send:message', {
        player: { socket_id: world.players[this.playerIndex].socket_id },
        text: 'No more in stock.',
      });

      return false;
    }

    return true;
  }

  /**
   * Buy an item from a store
   */
  buy() {
    const inStock = this.itemInStock();

    const { price } = Query.getItemData(this.itemId);
    const isBuying = this.getTrueBuyingQuantity();
    const toSpend = price * isBuying;
    const playerGold = this.inventory[this.coinIndex].qty;
    const moneyLeft = playerGold - toSpend;

    let rounds = this.stackable ? 1 : this.quantity;

    this.insufficient.funds = moneyLeft <= -1;
    if (this.insufficient.funds) rounds = 0;

    for (let index = 0; index < rounds; index += 1) {
      const itemToAdd = {
        id: this.itemId,
        uuid: uuid(),
        slot: UI.getOpenSlot(this.inventory),
      };

      this.inventory.push(itemToAdd);
    }

    if (rounds > 0) {
      this.inventory[this.coinIndex].qty = moneyLeft;
      this.shop[this.shopItemIndex].qty -= isBuying;
    }

    if ((!this.ableToBuyAll && inStock) || this.insufficient.funds || this.insufficient.space) {
      const msg = this.insufficient.funds ? 'Not enough gold to purchase.' : 'You were not able to buy all of the items.';
      Socket.emit('game:send:message', {
        player: { socket_id: world.players[this.playerIndex].socket_id },
        text: msg,
      });
    }

    return {
      inventory: this.inventory,
      shopItems: this.shop,
    };
  }

  /**
   * Get the value for an item to player
   */
  value() {
    const { price, name } = Query.getItemData(this.itemId);
    Socket.emit('game:send:message', {
      player: { socket_id: world.players[this.playerIndex].socket_id },
      text: `${name} costs ${price} coins.`,
    });
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

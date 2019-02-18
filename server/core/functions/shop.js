import world from '../world';
import UI from 'shared/ui';
import Query from '../data/query';
import { player } from '../../config';
import uuid from 'uuid/v4';
import Socket from '../../socket';
import { shops } from './../data/foreground';

class Shop {
  constructor(shopId, playerUuid, itemId, type, quantity) {
    this.shopIndex = world.shops.findIndex(i => i.npcId === shopId);
    this.shop = world.shops[this.shopIndex].inventory;

    this.playerIndex = world.players.findIndex(p => p.uuid === playerUuid);
    this.inventory = world.players[this.playerIndex].inventory;
    this.slotsAvailable = player.slots.inventory - this.inventory.length;

    this.itemId = itemId;
    this.coinIndex = this.inventory.findIndex(e => e.id === 'coins');
    this.shopItemIndex = this.shop.findIndex(q => q.id === this.itemId);
    this.shopItemQtyLeft = this.shop[this.shopItemIndex].qty;
    this.stackable = false;
    this.ableToBuyAll = false;

    this.quantity = this.getTrueStockableQuantity(quantity);
    this.insufficientSpace = false;
    this.insufficientFunds = false;

    // Are buying or selling? Change to source of items based on action
    this.source = (type === 'buy' ? this.shop : this.inventory);

    // The item we are acting on
    this.item = this.source.find(e => e.id === this.itemId);
  }

  static load() {
    return shops.map((s) => {
      s.inventory = s.inventory.map(Shop.formatData);
      return s;
    });
  }

  getTrueStockableQuantity(quantity) {
    const moreThanWeHave = this.shop[this.shopItemIndex].qty >= quantity;

    this.ableToBuyAll = moreThanWeHave === true;

    return moreThanWeHave ? quantity : this.shop[this.shopItemIndex].qty;
  }

  getTrueBuyingQuantity() {
    // If we don't have enought slots available,
    // then we must substract from quantity to get true amount.
    const slotsLeftQuantity = this.slotsAvailable - this.quantity;
    if (slotsLeftQuantity < 0) {
      this.quantity = this.slotsAvailable;
      this.insufficientSpace = true;
      return this.slotsAvailable;
    }

    return this.quantity < this.slotsAvailable ? this.quantity : slotsLeftQuantity;
  }

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

  buy() {
    // TODO
    // When buying 5 items buy only have coins for 3 items (buy remaining 3...)
    // Not enough space in inventory
    const inStock = this.itemInStock();

    const { price } = Query.getItemData(this.itemId);
    const isBuying = this.getTrueBuyingQuantity();
    const toSpend = price * isBuying;
    const playerGold = this.inventory[this.coinIndex].qty;
    const moneyLeft = playerGold - toSpend;

    let rounds = this.stackable ? 1 : this.quantity;

    this.insufficientFunds = moneyLeft <= -1;
    if (this.insufficientFunds) rounds = 0;

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

    if (rounds > 0) {
      this.inventory[this.coinIndex].qty = moneyLeft;
      this.shop[this.shopItemIndex].qty -= isBuying;
    }

    if ((!this.ableToBuyAll && inStock) || this.insufficientFunds || this.insufficientSpace) {
      const msg = this.insufficientFunds ? 'Not enough gold to purchase' : 'You were not able to buy all of the items.';
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

  value() {
    const { price, name } = Query.getItemData(this.itemId);
    Socket.emit('game:send:message', {
      player: { socket_id: world.players[this.playerIndex].socket_id },
      text: `${name} costs ${price} coins.`,
    });
  }

  static formatData(data, i) {
    return {
      id: data.item,
      qty: data.stock,
      slot: i,
    };
  }
}

export default Shop;

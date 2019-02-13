import { shops } from './../data/foreground';

class Shop {
  static load() {
    return shops.map((s) => {
      s.inventory = s.inventory.map(Shop.formatData);
      return s;
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

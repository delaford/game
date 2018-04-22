class Item {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.examine = data.examine;
    this.price = data.price;
    this.type = data.type;
    this.graphics = data.graphics;
    this.wearable = data.wearable || false;

    this.attack = data.attack;
    this.defence = data.defence;

    this.user = data.user;
    this.carried = data.carried;
    this.slot = data.slot;
    this.equipped = data.equipped;
  }
}

module.exports = Item;

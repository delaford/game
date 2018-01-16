class Item {
  constructor(data) {
    this.name = data.name;
    this.examine = data.examine;
    this.price = data.price;
    this.type = data.type;
    this.column = data.column;
    this.wearable = data.wearable || false;

    this.attack = data.attack;
    this.defence = data.defence;

    this.dropped = data.dropped;
    this.x = data.x;
    this.y = data.y;

    this.owner = data.owner;
    this.carried = data.carried;
    this.slot = data.slot;
    this.equipped = data.equipped;
  }
}

export default Item;

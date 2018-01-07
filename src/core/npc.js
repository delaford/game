class NPC {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.examine = data.examine;
    this.actions = data.actions;
    this.x = data.spawn.x;
    this.y = data.spawn.y;
    this.spawn = {
      x: data.spawn.x,
      y: data.spawn.y,
    };
    this.range = data.spawn.range;

    this.lastAction = 0;

    this.column = data.graphic.column;
  }

  getRange() {
    const coordinates = {
      topLeft: this.spawn.x - this.range,
      bottomRight: this.spawn.y + this.range,
    };

    return coordinates;
  }
}

export default NPC;

class NPC {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.examine = data.examine;
    this.actions = data.actions;
    this.x = data.spawn.x;
    this.y = data.spawn.y;
    this.range = data.spawn.range;

    this.column = data.graphic.column;
  }
}

export default NPC;

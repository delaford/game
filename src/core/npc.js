class NPC {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;

    // Examine text
    this.examine = data.examine;

    // What actions can be performed on them?
    this.actions = data.actions;

    // Where they will spawn on world restarts
    this.spawn = {
      x: data.spawn.x,
      y: data.spawn.y,
    };

    // Where are they right now?
    this.x = data.spawn.x;
    this.y = data.spawn.y;

    // How far they can walk from spawn location
    this.range = data.spawn.range;

    // When they last performed an action
    this.lastAction = 0;

    // What column they are on in tileset
    this.column = data.graphic.column;
  }
}

export default NPC;

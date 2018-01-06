class NPC {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.examine = data.examine;
    this.actions = data.actions;

    console.log(`[NPC] ${this.name} has spawned.`);
  }
}

export default NPC;

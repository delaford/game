class Map {
  constructor(config, map) {
    this.config = config;
    this.canvas = map;
    this.context = this.canvas.getContext("2d");
  }

  async build(player) {
    this.canvas.setAttribute("width", 512);
    this.canvas.setAttribute("height", 352);
    this.context.drawImage(player, 32, 32);
  }

  static surface() {
    return [1];
  }
}

export default Map;

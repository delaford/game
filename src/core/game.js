class Game {
  constructor(assets) {
    console.clear();
    this.assets = assets;
  }

  async init() {
    console.log(`Loading assets`, this.assets);
    const images = this.assets.map(asset => this.uploadImage(asset));
    const imgs = await Promise.all(images);
    return imgs;

    // const images = assets => Promise.all(assets.map(this.uploadImage));
    // images(this.assets);
  }

  uploadImage(path) {
    console.log(this.assets);
    const asset = new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(404);
      image.src = path;
    });

    return asset;
  }
}

export default Game;

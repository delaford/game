class Game {
  constructor(assets) {
    console.clear();
    this.assets = assets;
  }

  async init() {
    const images = this.assets.map(asset => this.uploadImage(asset));
    const promisedImages = await Promise.all(images);

    return promisedImages;
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

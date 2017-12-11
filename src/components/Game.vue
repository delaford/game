<template>
  <div>
    <canvas tabindex="0"
      id="ui-layer"
      class="main-canvas"
      height="352"
      width="512">
    </canvas>
  </div>
</template>

<script>
import config from "../core/config";
import Map from "../core/map";
import Game from "../core/game";

export default {
  name: "Game",
  data() {
    return {
      player: null,
      config,
      map: []
    };
  },
  async mounted() {
    const mainCanvas = document.querySelector(".main-canvas");    
    const game = new Game(this.config.assets);
    const {images, data} = await game.init();
    const map = new Map(mainCanvas);
    this.player = data.player;

    map.build(images[0]);
    // console.log(map.config.tileset.height);
  }
};
</script>

<style lang="scss" scoped>
/** Main canvas **/
canvas.main-canvas {
  background: #fff;
  outline: none;
}
</style>

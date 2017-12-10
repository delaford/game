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
import { player } from "../tempdb/player";
import config from "../core/config";
import Map from "../core/map";
import Game from "../core/game";

export default {
  name: "Game",
  data() {
    return {
      player,
      config,
      map: []
    };
  },
  async mounted() {
    const game = new Game(this.config.assets);
    const [_map, _player] = await game.init();

    const mainCanvas = document.querySelector(".main-canvas");
    const map = new Map(this.config.map, mainCanvas);
    map.build(_player);
    console.log(_map);
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

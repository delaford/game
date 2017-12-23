<template>
  <div>
    <canvas tabindex="0"
      id="ui-layer"
      class="main-canvas"
      height="352"
      width="512"
      @keyup="movePlayer">
    </canvas>
  </div>
</template>

<script>
/**
 * <-- Controller - Vue.js interactions
 * --> Model - JS core files
 * <-- View - HTML templates
 *
 * ex: (Vue) use right-clicks on map
 * (JS) Core files tells what to go in context menu
 * (HTML) What to and where to display
 */
import config from '../core/config';
import Map from '../core/map';
import Game from '../core/game';

export default {
  name: 'Game',
  data() {
    return {
      player: null,
      config,
      map: false,
      images: false,
      board: [],
    };
  },
  async mounted() {
    // Start game
    const game = new Game(this.config.assets);
    const { images, data } = await game.init();

    // Load map
    this.map = new Map('surface', images, data);
    this.images = images;

    // Assign data to Vue instance
    this.player = data.player;
    this.board = await this.map.load();

    this.map.build();
  },
  methods: {
    movePlayer(event) {
      const key = event.key;

      switch (key) {
        default:
        case 'ArrowRight':
          this.player.x += 1;
          this.map.context.drawImage(
            this.images[0],
            this.player.x * 32,
            0,
            32,
            32,
          );
          this.map.context.clearRect(
            0,
            0,
            this.map.context.width,
            this.map.context.height,
          );
          break;

        case 'ArrowLeft':
          this.player.x -= 1;
          this.map.context.drawImage(
            this.images[0],
            this.player.x * 32,
            0,
            32,
            32,
          );
          this.map.context.clearRect(
            0,
            0,
            this.map.context.width,
            this.map.context.height,
          );
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/** Main canvas **/
canvas.main-canvas {
  background: #fff;
  outline: none;
}
</style>

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
import Game from '../core/game';

export default {
  name: 'Game',
  data() {
    return {
      config,
      images: false,
      board: [],
    };
  },
  async mounted() {
    // Start game
    const game = new Game(this.config.assets);
    game.start();
  },
  methods: {
    movePlayer(event) {
      const key = event.key;

      switch (key) {
        default:
        case 'ArrowRight':
          this.player.x += 1;
          break;

        case 'ArrowLeft':
          this.player.x -= 1;
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

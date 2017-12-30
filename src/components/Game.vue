<template>
  <div>
    <canvas tabindex="0"
      id="game-map"
      class="main-canvas"
      height="352"
      width="512"
      @mousemove="mouseSelection"
      @click="mouseClick"
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
import UI from '../core/utilities/ui';

import bus from '../core/utilities/bus';

export default {
  name: 'Game',
  data() {
    return {
      config,
      game: false,
    };
  },
  async mounted() {
    // Start game
    this.game = new Game(this.config.assets);
    this.game.start();

    document.querySelector('canvas#game-map').focus();
  },
  methods: {
    mouseClick(event) {
      const { tile } = this.config.map.tileset;

      const clickedSquare = {
        x: Math.floor(UI.getMousePos(event).x / tile.width),
        y: Math.floor(UI.getMousePos(event).y / tile.height),
      };

      bus.$emit('MOVE:PLAYER', clickedSquare);
    },
    mouseSelection(event) {
      const { tile } = this.config.map.tileset;

      const hoveredSquare = {
        x: Math.floor(UI.getMousePos(event).x / tile.width),
        y: Math.floor(UI.getMousePos(event).y / tile.height),
      };

      if (hoveredSquare.x >= 0 && hoveredSquare.y >= 0) {
        const data = { x: hoveredSquare.x, y: hoveredSquare.y };

        bus.$emit('DRAW:MOUSE', data);
      }
    },
    movePlayer(event) {
      const key = event.key;

      switch (key) {
        default:
          console.log('Nothing happened');
          break;

        case 'ArrowRight':
          this.game.move('right');
          break;

        case 'ArrowLeft':
          this.game.move('left');
          break;

        case 'ArrowDown':
          this.game.move('down');
          break;

        case 'ArrowUp':
          this.game.move('up');
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

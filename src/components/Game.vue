<template>
  <div class="wrapper">
    <canvas tabindex="0"
      id="game-map"
      class="main-canvas"
      height="352"
      width="512"
      @mousemove="mouseSelection"
      @click.left="leftClick"
      @click.right="rightClick"
      @keyup="movePlayer">
    </canvas>

    <context-menu v-if="loaded" :game="data"></context-menu>
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

import ContextMenu from './sub/ContextMenu';

export default {
  name: 'Game',
  data() {
    return {
      config,
      loaded: false,
      game: false,
      data: null,
    };
  },
  components: {
    ContextMenu,
  },
  async mounted() {
    // Start game
    this.game = new Game(this.config.assets);
    await this.game.start();
    this.loaded = true;
    this.data = this.game;

    // Focus on the game-map
    document.querySelector('canvas#game-map').focus();
  },
  methods: {
    rightClick(event) {
      const coordinates = UI.getViewportCoordinaes(event);

      const data = {
        event,
        coordinates,
      };

      event.preventDefault();
      bus.$emit('PLAYER:MENU', data);
    },
    /**
     * Player clicks on game-map
     *
     * @param {event} event
     */
    leftClick(event) {
      const coordinates = UI.getViewportCoordinaes(event);

      // Send to game engine that
      // the player clicked to move
      bus.$emit('PLAYER:MOVE', coordinates);
    },
    /**
     * Player hovering over game-map
     *
     * @param {event} event
     */
    mouseSelection(event) {
      const { tile } = this.config.map.tileset;

      const hoveredSquare = {
        x: Math.floor(UI.getMousePos(event).x / tile.width),
        y: Math.floor(UI.getMousePos(event).y / tile.height),
      };

      if (hoveredSquare.x >= 0 && hoveredSquare.y >= 0) {
        const data = { x: hoveredSquare.x, y: hoveredSquare.y };
        if (this.game.map && typeof this.game.map.drawMouseSelection === 'function') {
          bus.$emit('DRAW:MOUSE', data);
        }
      }
    },
    /**
     * Player uses keyboard to move
     *
     * @param {event} event
     */
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
.wrapper {
  canvas.main-canvas {
    background: #fff;
    outline: none;
  }

  #context-menu {
    position: absolute;
  }
}
</style>

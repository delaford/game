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

    <context-menu v-if="loaded" :game="game"></context-menu>
  </div>
</template>

<script>
/**
 * <-- Controller - Vue.js interactions
 * --> Model - JS core files
 * <-- View - HTML templates
 *
 * ex: (Vue) use right-clicks on map
 * (JS) Core files tells data for context menu
 * (HTML) What to and where to display
 */
import config from '../core/config';
import Game from '../core/game';
import UI from '../core/utilities/ui';
import bus from '../core/utilities/bus';

import Engine from '../core/engine';

import ContextMenu from './sub/ContextMenu';

export default {
  name: 'Game',
  data() {
    return {
      config,
      loaded: false,
      game: false,
      fps: 0,
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

    const engine = new Engine(this.game);
    engine.start();

    // Focus on the game-map
    document.querySelector('canvas#game-map').focus();
  },
  methods: {
    /**
     * Right-click brings up context-menu
     *
     * @param {event} event The mouse-click event
     */
    rightClick(event) {
      const coordinates = UI.getViewportCoordinates(event);

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
     * @param {event} event The mouse-click event
     */
    leftClick(event) {
      const coordinates = UI.getViewportCoordinates(event);

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

      if (UI.userPressToMove(key)) {
        const direction = key.split('Arrow')[1].toLowerCase();
        this.game.move(direction);
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
#fps {
  position: absolute;
  top: 70px;
  left: 10px;
}
</style>

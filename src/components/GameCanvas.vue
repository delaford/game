<template>
  <div class="game">
    <canvas
      id="game-map"
      tabindex="0"
      class="main-canvas gameMap"
      height="352"
      width="512"
      @mousemove="mouseSelection"
      @click.left="leftClick"
      @click.right="rightClick"
      @keyup="movePlayer"/>
  </div>
</template>

<script>
import UI from 'shared/ui';
import config from 'root/config';
import Client from '../core/client';
import bus from '../core/utilities/bus';
import Socket from '../core/utilities/socket';

export default {
  name: 'Game',
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mouse: false,
    };
  },
  computed: {
    otherPlayers() {
      return this.game.players.filter(p => p.socket_id !== this.game.player.socket_id);
    },
  },
  created() {
    bus.$on('canvas:getMouse', () => this.mouseSelection());
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
        target: event.target,
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
      const data = {
        id: this.game.player.uuid,
        coordinates,
      };

      // Save latest mouse data
      this.mouse = event;

      Socket.emit('player:mouseTo', data);
      bus.$emit('contextmenu:close');
    },

    /**
     * Player hovering over game-map
     *
     * @param {MouseEvent} event
     */
    mouseSelection(event) {
      const mouseEvent = event || this.mouse;
      const { tile } = config.map.tileset;

      // Save latest mouse data
      this.mouse = mouseEvent;

      const hoveredSquare = {
        x: Math.floor(UI.getMousePos(mouseEvent).x / tile.width),
        y: Math.floor(UI.getMousePos(mouseEvent).y / tile.height),
      };

      if (hoveredSquare.x >= 0 && hoveredSquare.y >= 0) {
        const data = { x: hoveredSquare.x, y: hoveredSquare.y };
        if (
          this.game.map &&
          typeof this.game.map.setMouseCoordinates === 'function'
        ) {
          bus.$emit('DRAW:MOUSE', data);
        }
      }
    },

    /**
     * Player uses keyboard to move
     *
     * @param {event} event
     */
    movePlayer({ key }) {
      if (UI.userPressToMove(key)) {
        const direction = key.split('Arrow')[1].toLowerCase();
        const data = {
          id: this.game.player.uuid,
          direction,
        };

        Client.move(data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/** Main canvas **/
div.game {
  height: 352px;
  margin-bottom: 5px;

  canvas.main-canvas {
    border-top-left-radius: 3px;
    height: 352px;
    background: #fff;
    outline: none;
    cursor: pointer;
  }

  #context-menu {
    position: absolute;
  }
}
</style>

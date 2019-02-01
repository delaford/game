<template>
  <div class="game">
    <div
      v-if="current !== false"
      class="pane">
      <component
        :data="screenData"
        :game="game"
        :is="current"/>
    </div>
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
      current: false,
      screenData: false,
    };
  },
  computed: {
    otherPlayers() {
      return this.game.players.filter(p => p.socket_id !== this.game.player.socket_id);
    },
  },
  created() {
    bus.$on('canvas:getMouse', () => this.mouseSelection());

    bus.$on('open:screen', this.openScreen);
    bus.$on('screen:close', this.closePane);
  },
  methods: {
    closePane() {
      this.current = false;
    },
    openScreen(incoming) {
      this.current = incoming.data.screen;
      this.screenData = incoming.data.payload;
      console.log(incoming);
    },
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

      if (this.current !== false) {
        this.current = false;
      }

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
  position: relative;

  canvas.main-canvas {
    border-top-left-radius: 3px;
    height: 352px;
    background: #fff;
    outline: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
  }

  .pane {
    z-index: 5;
    position: relative;
    background: red;
    width: 90%;
    height: 90%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);

    div {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }

  #context-menu {
    position: absolute;
  }
}
</style>

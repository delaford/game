<template>
  <div class="game">
    <div
      class="first-action"
      v-html="action" />
    <div
      v-if="current !== false"
      :style="getPaneDimensions"
      class="pane">
      <component
        :game="game"
        :data="screenData"
        :is="current" />
    </div>
    <canvas
      id="game-map"
      tabindex="0"
      class="main-canvas gameMap"
      height="352"
      width="512"
      @mouseenter="onGame = true"
      @mouseleave="onGame = false"
      @mousemove="mouseSelection"
      @click.left="leftClick"
      @click.right="rightClick"
      @keyup="movePlayer"
    />
  </div>
</template>

<script>
import UI from 'shared/ui';
import config from 'root/config';
import Client from '../core/client';
import ClientUI from '../core/utilities/client-ui';
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
      onGame: false,
      current: false,
      screenData: false,
      tileX: 0,
      tileY: 0,
      event: false,
    };
  },
  computed: {
    getPaneDimensions() {
      switch (this.current) {
      default:
        return '';
      case 'furnace':
        return 'width:70%;height:40%';
      }
    },
    currentAction() {
      return this.$store.getters.action.object;
    },
    action() {
      return this.$store.getters.action.label;
    },
    otherPlayers() {
      return this.game.players.filter(
        p => p.socket_id !== this.game.player.socket_id,
      );
    },
  },
  watch: {
    current(newVal) {
      if (typeof newVal === 'boolean') {
        Socket.emit('player:pane:close', {
          id: this.game.player.uuid,
        });
      }
    },
  },
  created() {
    bus.$on('canvas:getMouse', () => this.mouseSelection());
    bus.$on('open:screen', this.openScreen);
    bus.$on('screen:close', this.closePane);
    bus.$on('game:context-menu:first-only', ClientUI.displayFirstAction);
    bus.$on('canvas:reset-context-menu', () => this.mouseSelection());
  },
  methods: {
    /**
     * Close the context-menu
     */
    closePane() {
      this.current = false;
    },
    /**
     * Open the context-menu
     *
     * @param {object} incoming The data returned from the context-menu
     */
    openScreen(incoming) {
      this.current = incoming.data.screen;
      this.screenData = incoming.data.payload;
      console.log(this.screenData);
      bus.$emit('pane:data', this.screenData);
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
      bus.$emit('screen:close');
      bus.$emit('canvas:select-action', {
        event,
        item: this.currentAction,
      });
    },

    /**
     * Player hovering over game-map
     *
     * @param {MouseEvent} event
     */
    mouseSelection(event) {
      if (event) {
        this.event = event;
      }

      if (!this.onGame) return;
      const mouseEvent = this.event || this.mouse;
      const { tile } = config.map.tileset;

      // Save latest mouse data
      this.mouse = mouseEvent;

      const hoveredSquare = {
        x: Math.floor(UI.getMousePos(mouseEvent).x / tile.width),
        y: Math.floor(UI.getMousePos(mouseEvent).y / tile.height),
      };

      const data = { x: hoveredSquare.x, y: hoveredSquare.y };
      if (
        this.game.map
        && typeof this.game.map.setMouseCoordinates === 'function'
      ) {
        if (hoveredSquare.x >= 0 && hoveredSquare.y >= 0) {
          bus.$emit('DRAW:MOUSE', data);
        }

        // eslint-disable-next-line
        if (
          !event
          || ((this.tileX !== hoveredSquare.x || this.tileY !== hoveredSquare.y)
            && this.event
            && this.event.target)
        ) {
          this.tileX = hoveredSquare.x;
          this.tileY = hoveredSquare.y;

          bus.$emit('PLAYER:MENU', {
            coordinates: hoveredSquare,
            event: this.event,
            target: this.event.target,
            firstOnly: true,
          });
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

  .first-action {
    position: relative;
    z-index: 9;
    left: 0.5em;
    top: 0.5em;
    font-size: 0.75em;
    text-align: left;
    font-family: "GameFont", sans-serif;
    text-shadow: 1px 1px 0 #000;
    color: #fff;
  }

  .pane {
    z-index: 5;
    width: 90%;
    height: 90%;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

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

<template>
  <div class="game">
    <canvas tabindex="0"
      id="game-map"
      class="main-canvas gameMap"
      height="352"
      width="512"
      @mousemove="mouseSelection"
      @click.left="leftClick"
      @click.right="rightClick"
      @keyup="movePlayer">
    </canvas>
  </div>
</template>

<script>
import Client from '../core/client';
import config from '../core/config';
import UI from '../core/utilities/ui';
import bus from '../core/utilities/bus';
import Socket from '../core/utilities/socket';

export default {
  name: 'Game',
  props: ['game'],
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

      Socket.emit('player:mouseTo', data);
    },

    /**
     * Player hovering over game-map
     *
     * @param {event} event
     */
    mouseSelection(event) {
      const { tile } = config.map.tileset;

      const hoveredSquare = {
        x: Math.floor(UI.getMousePos(event).x / tile.width),
        y: Math.floor(UI.getMousePos(event).y / tile.height),
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
    movePlayer(event) {
      const key = event.key;

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
  computed: {
    otherPlayers() {
      return this.game.players.filter(
        p => p.socket_id !== this.game.player.socket_id,
      );
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

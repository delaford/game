<template>
  <div
    id="context-menu"
    :style="style"
    @click.right="contextClick">
    <ul
      v-if="view"
      id="actions"
      tabindex="-1"
      @blur="closeMenu">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="action"
        @click="selectAction($event, item)"
        v-html="item.label"
      />
      <li
        class="action"
        @click="selectAction($event, { action: { name: 'cancel'} })">Cancel</li>
    </ul>
  </div>
</template>

<script>
import { omit } from 'lodash';
import bus from '../../core/utilities/bus';
import Socket from '../../core/utilities/socket';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: false,
      mouseEvent: false,
      actions: {},
      view: false,
      tile: {
        x: null,
        y: null,
      },
      style: {
        top: '0px',
        left: '0px',
      },
    };
  },
  created() {
    bus.$on('PLAYER:MENU', this.buildMenu);
    bus.$on('game:context-menu:items', this.createMenu);
    bus.$on('contextmenu:close', this.closeMenu);
    bus.$on('canvas:select-action', (event) => {
      this.selectAction(event.event, event.item);
    });
  },
  methods: {
    /**
     * Tell the game to do the selected action
     *
     * @param {event} event The mouse-click event
     * @param {string} item The menu item selected
     */
    async selectAction(event, item) {
      // Data to perform action
      const data = {
        item,
        tile: this.tile,
      };

      // Data for queued action
      const queueItem = {
        item: {
          uuid: item.uuid,
          id: item.id,
        },
        tile: this.tile,
        action: item.action,
        at: item.at || false,
        coordinates: item.coordinates || false,
        queueable: item.action.queueable,
      };

      // Tell server to do action
      Socket.emit('player:context-menu:action', {
        data,
        queueItem,
        player: {
          socket_id: this.game.player.socket_id,
        },
      });

      // Close menu and focus back on game
      this.closeMenu();
      window.focusOnGame();
    },

    /**
     * Sets the context-menu where mouse was clicked upon
     *
     * @param {integer} x The x-axis of where the mouse was clicked
     * @param {integer} y The y-axis of where the mouse was clicked
     */
    setMenu(x, y) {
      this.style.left = `${x - 9}px`;
      this.style.top = `${y - 7}px`;
    },

    /**
     * Closes the context-menu
     */
    closeMenu() {
      this.view = false;
    },

    /**
     * Tell server to start building the menu
     * @param {object} data The coordinates of the player and MouseEvent
     */
    buildMenu(data) {
      // Tile coordinates and mouse event
      this.mouseEvent = data.event;
      this.tile.x = data.coordinates.x;
      this.tile.y = data.coordinates.y;

      // Remove misc info
      const miscData = omit(
        { ...data, clickedOn: data.event.target.classList },
        ['coordinates', 'event', 'target'],
      );

      // Tell server to start building context menu
      Socket.emit('player:context-menu:build', {
        miscData,
        tile: this.tile,
        player: {
          socket_id: this.game.player.socket_id,
        },
      });
    },

    /**
     * Generates the list of selectable items on context-menu
     *
     * @param {object} data The list of items for the context menu
     */
    createMenu(data) {
      // List has been generated from server
      this.items = data.data.data
        .sort((a, b) => b.timestamp - a.timestamp) // Sort by when item appeared
        .sort((a, b) => a.action.weight - b.action.weight); // then by action weight

      // Ready to show
      this.view = true;

      // On next vue tick, show map
      this.$nextTick(() => {
        // Set context menu on map
        this.setMenu(this.mouseEvent.x, this.mouseEvent.y);
      });
    },

    /**
     * Incase we click on the context menu with anything but a left-click
     *
     * @param {event} event The non-left mouse-click on the context-menu
     */
    contextClick(event) {
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
$menu_bg_color: #8d8d8d;
$menu_font_color: #fff;
$menu_min_width: 100px;
$menu_max_width: 195px;
$menu_font_hover_color: #ffd829;

div {
  position: absolute;
  z-index: 99999999;

  ul#actions {
    font-family: "GameFont", sans-serif;
    box-shadow: 2.5px 2.5px 0 0 rgba(0, 0, 0, 0.75);
    outline: none;
    background: $menu_bg_color;
    display: block;
    list-style: none;
    margin: 0;
    padding: 0 0 3px 0;
    max-width: $menu_max_width;
    min-width: $menu_min_width;
    font-size: 12px;
    z-index: 999999;

    li.action {
      cursor: pointer;
      color: $menu_font_color;
      text-align: left;
      padding: 2px 5px;
      text-shadow: 1px 1px 0 #000;
      margin: 0;

      &:hover {
        color: $menu_font_hover_color;
      }
    }
  }
}
</style>

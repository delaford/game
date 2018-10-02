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
        v-html="item.label"/>
      <li
        class="action"
        @click="selectAction($event, { action: { name: 'cancel'} })"
      >Cancel</li>
    </ul>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import Actions from '../../core/player/actions';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      actions: {},
      view: false,
      onMap: false,
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
    bus.$on('PLAYER:MENU', this.openMenu);
    bus.$on('CLOSE:MENU', () => this.closeMenu());
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
        coordinate: 2,
        queueable: item.action.queueable,
      };

      this.actions.do(data, queueItem);

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
      this.onMap = false;
    },
    /**
     * Generates the list of selectable items on context-menu
     *
     * @param {object} data The coordinates clicked on
     */
    async openMenu(data) {
      this.tile.x = data.coordinates.x;
      this.tile.y = data.coordinates.y;

      const miscData = window._.omit({ ...data }, ['coordinates', 'event', 'target']);

      this.actions = new Actions(this.game, this.tile, data.event, miscData);
      this.items = await this.actions.build();
      this.items = this.items.sort((a, b) => a.action.weight - b.action.weight);

      this.view = true;

      const targetElement = data.target.className;

      this.$nextTick(() => {
        if (targetElement.includes('gameMap')) {
          this.onMap = true;
        }

        this.setMenu(data.event.x, data.event.y);
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
    box-shadow: 2.5px 2.5px 0px 0px rgba(0, 0, 0, 0.75);
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
      text-shadow: 1px 1px 0px #000;
      margin: 0;

      &:hover {
        color: $menu_font_hover_color;
      }
    }
  }
}
</style>

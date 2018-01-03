<template>
  <div @click.right="contextClick" id="context-menu" v-bind:style="style">
      <ul
        v-if="viewMenu"
        ref="right"
        @blur="closeMenu"
        id="right-click-menu"
        tabindex="-1">
          <li v-for="(item, index) in items" :key="index" @click="selectAction($event, item)">
            {{ item }}
          </li>
      </ul>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import Actions from '../../core/engine/actions';

export default {
  props: ['game'],
  mounted() {
    console.log(this.game);
  },
  created() {
    bus.$on('PLAYER:MENU', this.openMenu);
    this.$forceUpdate();
  },
  data() {
    return {
      actions: {},
      viewMenu: false,
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
  methods: {
    selectAction(event, item) {
      const data = {
        item,
        tile: this.tile,
        actions: this.actions,
      };

      bus.$emit('ITEM:DO', data);

      this.closeMenu();
    },
    setMenu(x, y) {
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
      this.$forceUpdate();
    },

    closeMenu() {
      this.viewMenu = false;
    },
    async openMenu(data) {
      this.tile.x = data.coordinates.x;
      this.tile.y = data.coordinates.y;

      this.actions = new Actions(this.game);
      this.items = await this.actions.build();

      this.viewMenu = true;

      this.$nextTick(
        () => {
          this.$refs.right.focus();
          this.setMenu(data.event.x, data.event.y);
        },
      );
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

@font-face {
  font-family: "GameFont";
  src: url("../../assets/fonts/pixelmix.ttf") format("truetype"),
    url("../../assets/fonts/pixelmix_bold.ttf") format("truetype");
}

#right-click-menu {
  font-family: "GameFont", sans-serif;
  box-shadow: 2.5px 2.5px 0px 0px rgba(0, 0, 0, 0.75);
  outline: none;
  background: $menu_bg_color;
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 120px;
  font-size: 12px;
  z-index: 999999;

  li {
    cursor: pointer;
    color: $menu_font_color;
    text-align: left;
    padding: 2px 5px;
    text-shadow: 1px 1px 0px #000;
    margin: 0;
  }
}

#right-click-menu li:hover {
  color: #ffd829;
}
</style>

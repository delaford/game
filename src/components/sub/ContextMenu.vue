<template>
  <div @click="contextClick" id="context-menu" v-bind:style="style">
      <ul
        v-if="viewMenu"
        ref="right"
        @blur="closeMenu"
        id="right-click-menu"
        tabindex="-1">
          <li @click="selectAction">Walk here</li>
          <li @click="selectAction">Cancel</li>
      </ul>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';

export default {
  created() {
    bus.$on('menu', this.openMenu);
  },
  data() {
    return {
      viewMenu: false,
      style: {
        top: '0px',
        left: '0px',
      },
    };
  },
  methods: {
    selectAction() {
      console.log('Action selected');
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

    openMenu(e) {
      this.viewMenu = true;
      this.$nextTick(
        () => {
          this.$refs.right.focus();
          this.setMenu(e.x, e.y);
        },
      );
    },
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

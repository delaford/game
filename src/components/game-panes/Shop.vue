<template>
  <div class="shopView">
    <pane-header :text="data.name" />
    <item-grid
      :images="game.map.images"
      :items="data.inventory"
      :slots="200"
      screen="shop" />
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      gameData: this.game.player.bank,
    };
  },
  computed: {
    bankItems() {
      return this.game.player.bank;
    },
  },
};
</script>

<style lang="scss" scoped>
$color: #706559;
$background_color: #ededed;
$default_color: #383838;

.shopView {
  background-color: $color;
  font-family: "GameFont", serif;
  border: 5px solid darken($color, 10%);

  .header {
    background: lighten($color, 10%);
    height: 30px;

    .close {
      float: right;
      width: 30px;
      box-sizing: border-box;
      height: 30px;
      background-color: darken(red, 10%);
      color: white;
      font-size: 1em;
      padding: 5px 2px 5px 5px;
    }
  }

  .main {
    padding: .5em;
  }
}
</style>

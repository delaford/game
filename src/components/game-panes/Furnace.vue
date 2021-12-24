<template>
  <div class="furnaceView">
    <pane-header text="Furnace" />
    <p>
      Select the bar you want to smelt
    </p>
    <item-grid
      :images="game.map.images"
      :items="barItems"
      :slots="6"
      class="furnaceGrid"
      screen="furnace" />
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
      smithingLevel: this.game.player.skills.smithing.level,
    };
  },
  computed: {
    itemDetail() {
      return {
        'bronze-bar': 1,
        'iron-bar': 19,
        'silver-bar': 25,
        'steel-bar': 40,
        'gold-bar': 47,
        'jatite-bar': 55,
      };
    },
    barItems() {
      return this.data.items.map((e, index) => ({
        qty: 1,
        slot: index,
        id: e,
        isLocked: this.itemDetail[e] <= this.smithingLevel ? '' : 'locked-item',
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
$color: #706559;
$background_color: #ededed;
$default_color: #383838;

p {
  font-size: .6em;
  margin: 1em 0;
}

.furnaceGrid {
  display: flex;
  justify-content: center;
  height: auto;
}

.furnaceView {
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

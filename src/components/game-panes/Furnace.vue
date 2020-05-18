<template>
  <div class="furnaceView">
    <pane-header text="Furnace" />
      <p>
        Select the bar you want to smelt. 
      </p>
    <item-grid
      :images="game.map.images"
      :items="barItems"
      class="furnaceGrid"
      :slots="7"
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
      gameData: this.game.player.bank,
    };
  },
  computed: {
    barItems() {
      return this.data.items.map((e ,index) => {
        return {
            qty: 1,
            slot: index,
            id: e
          }
      });
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

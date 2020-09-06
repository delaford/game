<template>
  <div class="anvilView">
    <pane-header text="Anvil" />
    <p>
      What would you like to make?
    </p>
    <item-grid
      :images="game.map.images"
      :items="barItems"
      :slots="6"
      class="anvilGrid"
      screen="anvil" />
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
    barItems() {
      return this.data.items.map((e, index) => ({
        qty: 1,
        slot: index,
        id: e.item,
        isLocked: e.level <= this.smithingLevel ? '' : 'locked-item',
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

.anvilGrid {
  display: flex;
  justify-content: center;
  height: auto;
}

.anvilView {
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

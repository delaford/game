<template>
  <item-grid
    :images="game.map.images"
    :items="items"
    :slots="24"
    screen="inventory" />
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    images() {
      return this.game.map.images;
    },
    items() {
      return this.game.player.inventory;
    },
  },
};
</script>

<style lang="scss" scoped>
div.inventory_slot {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(4, 35px);
  grid-template-rows: repeat(6, 35px);
  grid-gap: 5px;

  div.slot {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin: 1px 0 0 1px;
    text-align: center;
    background-color: transparent;
  }
}
</style>

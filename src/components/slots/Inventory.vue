<template>
  <div class="inventory_slot">
    <div v-for="(item, i) in items" class="item"></div>
  </div>
</template>

<script>
export default {
  props: ['game'],
  computed: {
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
  grid-template-rows: repeat(5, 35px);
  grid-gap: 5px;
  div.item {
    cursor: pointer;
    width: 35px;
    height: 35px;
    text-align: center;
    background: darken(grey, 5%);
  }
}
</style>

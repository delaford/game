<template>
  <div class="stats_slot">
    <ul>
      <li v-for="(stat, i) in skills" :key="i">
        <span v-text="stat.name" :title="stat.exp + ' experience points'"></span>
        <span class="level">{{ stat.level }} / 99</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['game'],
  computed: {
    skills() {
      return this.game.player.skills;
    },
  },
};
</script>

<style lang="scss" scoped>
div.stats_slot {
  height: 100%;
  font-family: "GameFont", sans-serif;
  text-align: left;
  text-shadow: 1px 1px 0px black;
  font-size: 12px;

  ul {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 2em;

    li {
      span.level {
        float: right;
      }
    }
  }
}
</style>

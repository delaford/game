<template>
  <div class="stats_slot">
    <ul>
      <li
        v-for="(stat, i) in skills"
        :key="i">
        <span
          :title="stat.exp + ' experience points'"
          v-text="stat.name"/>
        <span class="level">{{ stat.level }} / 99</span>
      </li>
    </ul>
  </div>
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
  text-shadow: 1px 1px 0 black;
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

<template>
  <div class="stats_slot">
    <ul>
      <li
        v-tippy
        v-for="(item, key, index) in skills"
        :title="`${item.exp} exp`"
        :key="index">
        <span v-text="capitalizeFirstLetter(key)"/>
        <span class="level">{{ item.level }} / 99</span>
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
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
  font-size: .75em;

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

      div.exp {
        line-height: 1em;
      }
    }
  }
}
</style>

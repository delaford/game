<template>
  <div class="stats_slot">
    <ul>
      <li
        v-tippy
        v-for="(skill, key, index) in skills"
        :title="`${skill.exp} exp`"
        :key="index">
        <span
          class="skill-name"
          v-text="key" />
        <span class="level">{{ skill.level }} / 99</span>
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
      span.skill-name {
        text-transform: capitalize;
      }

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

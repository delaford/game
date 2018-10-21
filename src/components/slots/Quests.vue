<template>
  <div class="quests">
    <ul class="list">
      <li
        v-for="(quest, i) in quests"
        :key="i"
        class="item">
        <span
          class="name"
          v-text="quest.name"/>
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
  data() {
    return {
      quests: [
        {
          name: 'Haunted Trails',
          completed: false,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
div.quests {
  height: 100%;

  ul.list {
    height: 100%;
    padding: 0;
    border: 4px solid darken(grey, 10%);
    background-color: lighten(grey, 8%);
    box-sizing: border-box;
    margin: 0;
    width: 100%;
    list-style: none;
    text-align: left;
    font-size: 14px;
    line-height: 1.5em;

    li.item {
      padding: 0 3px;
      cursor: pointer;
      color: rgb(255, 0, 0);

      &:nth-child(odd) {
        background-color: lighten(grey, 15%);
      }

      &:nth-child(even) {
        background-color: darken(grey, 5%);
      }

      span.name {
        text-shadow: 1px 1px 0 black;
        font-family: "ChatFont", sans-serif;
      }
    }
  }
}
</style>

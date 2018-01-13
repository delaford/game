<template>
  <div class="friend_list">
    <ul class="list">
      <li class="item" v-for="(friend, i) in sorted_list">
        <span class="name" v-text="friend.user"></span>
        <span class="status" :class="{ connected: friend.online}"></span>
      </li>
    </ul>

    <div class="actions">
      <button class="button">Add</button>
      <button class="button">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['game'],
  computed: {
    friend_list() {
      return this.game.player.friend_list;
    },
    sorted_list() {
      return this.friend_list.sort((a, b) => b.online - a.online);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main";

div.friend_list {
  height: 100%;
  display: grid;
  grid-template-rows: 85% auto;

  div.actions {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
  }

  ul.list {
    padding: 5px;
    border: 4px solid darken(grey, 10%);
    background-color: lighten(grey, 8%);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
    text-align: left;
    font-size: 14px;
    line-height: 1.5em;

    li.item:nth-child(odd) {
      background-color: lighten(grey, 15%);
    }

    li.item:nth-child(even) {
      background-color: darken(grey, 5%);
    }

    li.item {
      padding: 0 3px;
      span.name {
        text-shadow: 1px 1px 0px black;
        font-family: "ChatFont", sans-serif;
      }

      span.status {
        float: right;
        &::after {
          margin-right: auto;
          background: rgb(190, 50, 50);
          content: "";
          display: inline-block;
          border-radius: 50%;
          height: 7px;
          vertical-align: middle;
          width: 7px;
        }
      }
      span.connected {
        &::after {
          background-color: rgb(45, 214, 45);
        }
      }
    }
  }
}
</style>

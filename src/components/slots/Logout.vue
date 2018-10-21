<template>
  <div class="logout">
    <p>Please logout using this button to safely exit the game to save your progress.</p>
    <button
      class="button is-danger is-big"
      @click="logout">Logout</button>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import Socket from '../../core/utilities/socket';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
    logout() {
      bus.$emit('player:logout');
      Socket.emit('player:logout', { id: this.game.player.socket_id });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main";

div.logout {
  font-family: "UIFont", sans-serif;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  p {
    text-shadow: 1px 1px 0 #000;
    padding: 0 10px;
  }

  button {
    width: 50%;
  }
}
</style>

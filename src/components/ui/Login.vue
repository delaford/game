<template>
  <div class="form">
    <div class="inputs">
      <input placeholder="Username" type="text" class="username" v-model="username" spellcheck="false" autocomplete="off">
      <input placeholder="Password" type="password" class="password" v-model="password">
    </div>

    <div class="action_buttons">
      <button class="button" @click="login">Login</button>
      <button class="button" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import Socket from '../../core/utilities/socket';

export default {
  methods: {
    cancel() {
      bus.$emit('go:main');
      // Does nothing -- atm.
    },
    // Send login request to server.
    login() {
      const data = { username: this.username, password: this.password };

      Socket.emit('player:login', data);
    },
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main";

div.form {
  width: 100%;

  .inputs {
    display: flex;
    flex-direction: column;

    input {
      font-size: 15pt;
      outline: none;
      padding: 5px 8px;
      background: transparent;
      border-style: solid;
      color: rgb(192, 192, 83);
      border-color: white;
      border-width: 0 0 2px 0;
      margin-bottom: 1em;
      font-family: "ChatFont";
      text-shadow: 1px 1px 0 #000;

      &:focus {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .action_buttons {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;

    button {
      font-size: 1.5em;
    }
  }
}
</style>

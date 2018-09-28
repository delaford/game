<template>
  <div class="form">
    <div class="inputs">
      <form
        :class="{ hasErrors: invalid }"
        action=""
        autocomplete="off">
        <input
          ref="username"
          v-model="username"
          placeholder="Username"
          type="text"
          class="username"
          autocorrect="off"
          spellcheck="false"
          autofocus
          autocomplete="off"
          @keyup.enter="login">
        <input
          v-model="password"
          placeholder="Password"
          type="password"
          class="password"
          autocomplete="off"
          @keyup.enter="login">
      </form>

      <div
        v-if="invalid"
        class="error_message">
        Incorrect login. Please try again.
      </div>
    </div>

    <div class="action_buttons">
      <button
        class="button"
        @click="login">Login</button>
      <button
        class="button"
        @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import Socket from '../../core/utilities/socket';

export default {
  data() {
    return {
      invalid: false,
      username: '',
      password: '',
      musicIntroduced: false,
    };
  },
  created() {
    this.invalid = false;
    bus.$on('player:login-error', data => this.incorrectLogin(data));

    if (!window.location.href.includes('.com')) {
      // Development user
      this.username = 'dev';
      this.password = 'qwertykeyboard';
    }
  },
  methods: {
    /**
     * Load up the glorious music
     */
    introduceMusic() {
      bus.$emit('music:start');
    },
    /**
     * Cancels login and goes back to main
     */
    cancel() {
      bus.$emit('go:main');
    },
    /**
     * Send login request to server.
     */
    login() {
      this.invalid = false;
      const data = { username: this.username, password: this.password, url: window.location.href };

      Socket.emit('player:login', data);
    },
    /**
     * Displays when a user login is invalid
     *
     * @param  {object} data The return object with data
     */
    incorrectLogin(data) {
      this.invalid = true;
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main";

div.form {
  width: 100%;

  form {
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

      &:last-child {
        margin-bottom: 0;
      }

      &:focus {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  form.hasErrors {
    input {
      background:rgba(255, 0, 0, .5);
      border-bottom-color: rgba(255, 0, 0, .7);
    }
  }

  .error_message {
    margin-top: 1em;
    background: #F44336;
    padding: .25em 0;
    color: #FAFAFA;
  }

  .action_buttons {
    display: inline-flex;
    width: 100%;
    margin-top: 1em;
    justify-content: space-between;

    button {
      font-size: 1.5em;
    }
  }
}
</style>

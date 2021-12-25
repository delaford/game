<template>
  <div class="form">
    <div
      v-tippy
      title="Load pre-made guest account. No progress will be saved on this account."
      class="checkbox guest_account">
      <label for="guest_account">
        <input
          id="guest_account"
          v-model="guestAccount"
          type="checkbox"
          @change="toggleGuestAccount">
        Guest account?
      </label>
    </div>
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
        class="button login"
        @click="login">Login</button>
      <div
        v-tippy
        v-if="inDevelopment"
        title="Dev account details will be saved and auto-logged in upon code changes."
        class="checkbox">
        <label for="rememberMe">
          <input
            id="rememberMe"
            v-model="rememberMe"
            type="checkbox"
            @change="toggleRememberMe">
          Remember me?
        </label>
      </div>
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
      guestAccount: false,
      musicIntroduced: false,
      rememberMe: false,
      isLoginInProgress: false,
    };
  },
  computed: {
    /**
     * Show only if on production website
     */
    inDevelopment() {
      return process.env.NODE_ENV !== 'production';
    },
  },
  watch: {
    guestAccount() {
      // Set back to guest credentials if false
      if (this.guestAccount) {
        this.username = 'dev';
        this.password = 'qwertykeyboard';
      } else {
        this.username = '';
        this.password = '';
      }
    },
  },
  created() {
    this.invalid = false;

    const tempGuest = window.location.href.includes('?useGuestAccount');

    this.rememberMe = this.$store.getters.rememberMe;
    this.guestAccount = tempGuest || this.$store.getters.guestAccount;

    bus.$on('player:login-error', data => this.incorrectLogin(data));
    bus.$on('login:done', () => this.setLoginProgress(false));

    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('inDev', this.inDevelopment);

    if (this.guestAccount && process.env.NODE_ENV === 'development') {
      // Development user
      this.username = 'dev';
      this.password = 'qwertykeyboard';
    }

    if (this.$store.getters.account.username) {
      const { username, password } = this.$store.getters.account;
      this.username = username;
      this.password = password;
      if (window.location.href.includes('#autologin')) {
        this.username = username;
        this.password = password;
        setTimeout(() => document.querySelector('button.login').click(), 250);
      }
    }
  },
  methods: {
    toggleGuestAccount() {
      this.$store.dispatch('setGuestAccount', this.guestAccount);
    },
    /**
     * Save the state between remember me checkbox
     */
    toggleRememberMe() {
      this.$store.dispatch('setRememberMe', this.rememberMe);

      const url = this.rememberMe ? `${window.location.origin}/?#autologin` : window.location.origin;

      window.history.pushState('Page', 'Title', url);
    },
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
      if (this.isLoginInProgress) return;
      this.setLoginProgress(true);
      this.invalid = false;
      const data = {
        username: this.username,
        password: this.password,
        useGuestAccount: this.guestAccount,
      };

      this.$store.dispatch('rememberDevAccount', { username: this.username, password: this.password });
      Socket.emit('player:login', data);
    },
    /**
     * Displays when a user login is invalid
     */
    incorrectLogin() {
      this.setLoginProgress(false);
      this.invalid = true;
    },
    setLoginProgress(isLoginInProgress) {
      this.isLoginInProgress = isLoginInProgress;
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
      font-family: "ChatFont", sans-serif;
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
      background: rgba(255, 0, 0, 0.5);
      border-bottom-color: rgba(255, 0, 0, 0.7);
    }
  }

  .error_message {
    margin-top: 1em;
    background: #F44336;
    padding: 0.25em 0;
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

  .checkbox {
    background: #b93636;
    border: 2px solid #521414;
    color: #c0c053;
    margin-top: 0.25em;
    padding: 0.25em;
    font-family: "ChatFont", sans-serif;
    text-shadow: 1px 1px 0 #000;
  }

  .guest_account {
    position: absolute;
    left: 1em;
    bottom: 1em;
  }
}
</style>

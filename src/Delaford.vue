<template>
  <div id="app">
    <!-- Login screen -->
    <div
      v-show="!loaded || game.exit"
      class="wrapper login__screen">
      <AudioMainMenu />
      <div
        v-if="screen === 'server-down'"
        class="bg server__down">
        The game server is down. Please check the website for more information.
      </div>
      <div
        v-else
        class="bg">
        <div
          v-if="screen === 'register'"
          class="register">
          To register an account, please visit <a href="https://delaford.com/register">this page</a> to get started and then come back.
        </div>
        <div
          v-if="screen === 'login'"
          class="login">
          <img
            class="logo"
            src="./assets/logo.png"
            alt="Logo">

          <Login/>
        </div>
        <div v-if="screen === 'main'">
          <img
            class="logo"
            src="./assets/logo.png"
            alt="Logo">

          <div class="button_group">
            <button
              class="login"
              @click="screen = 'login'">
              Login
            </button>

            <button
              class="register"
              @click="screen = 'register'">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Game wrapper -->
    <div
      v-show="loaded && game.map"
      class="wrapper"
      @click.right="nothing">
      <div class="left">
        <!-- Main canvas -->
        <GameCanvas :game="game" />

        <!-- Chatbox -->
        <Chatbox :game="game" />
      </div>
      <div
        class="right"
        @click="sidebarClicked">
        <!-- Player overview -->
        <Info :game="game" />

        <!-- Slots (Stats, Wear, Inventory, etc.) -->
        <Slots
          ref="sidebarSlots"
          :game="game" />
      </div>

      <context-menu :game="game"/>
    </div>
    <!-- End Game wrapper -->
  </div>
</template>

<script>
// Vue components
import config from 'root/config';
import GameCanvas from './components/GameCanvas.vue';
import Chatbox from './components/Chatbox.vue';
import Slots from './components/Slots.vue';
import Info from './components/Info.vue';

// Sub Vue components
import ContextMenu from './components/sub/ContextMenu.vue';
import AudioMainMenu from './components/sub/AudioMainMenu.vue';
import Login from './components/ui/Login.vue';

// Core assets
import Client from './core/client';
import Engine from './core/engine';
import bus from './core/utilities/bus';
import Event from './core/player/events';

export default {
  name: 'Delaford',
  components: {
    GameCanvas, Chatbox, Info, Slots, ContextMenu, Login, AudioMainMenu,
  },
  data() {
    return {
      config,
      loaded: false,
      game: { exit: true },
      screen: 'login',
    };
  },
  /**
   * WebSocket event handler
   */
  created() {
    const context = this;

    // Reload window upon Socket close
    window.ws.onclose = () => setTimeout(() => window.location.reload(), 1000);

    window.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      const eventName = data.event;

      const canRefresh = ['world', 'player', 'item'].some(e => eventName.split(':').includes(e));
      // Did the game canvas change that we need
      // to refresh the first context action?
      if (data && eventName && canRefresh) {
        bus.$emit('canvas:reset-context-menu');
      }

      if (eventName !== undefined) {
        if (!Event[eventName]) {
          bus.$emit(eventName, data);
        } else {
          Event[eventName](data, context);
        }
      } else {
        console.log(data);
      }
    };

    // On server connection error,
    // show the appropriate screen
    window.ws.onerror = () => {
      this.screen = 'server-down';
    };

    bus.$on('show-sidebar', this.showSidebar);

    // On logout, let's do a few things...
    bus.$on('player:logout', this.logout);
    bus.$on('go:main', this.cancelLogin);
  },
  methods: {
    /**
     * Logout player
     */
    logout() {
      this.screen = 'login';
      this.game = { exit: true };
      this.$refs.sidebarSlots.selected = 1;
    },

    /**
      * Cancel login
      */

    cancelLogin() {
      this.screen = 'main';
    },

    /**
     * Player movement, do something
     */
    playerMovement(data) {
      if (this.game.player.uuid === data.uuid) {
        this.game.map.player = data;
        this.game.player = data;
        if (data.inventory.slots) {
          this.game.map.player.inventory = data.inventory.slots;
          this.game.player.inventory = data.inventory.slots;
        }
      } else {
        const playerIndex = this.game.map.players.findIndex(p => p.uuid === data.uuid);

        this.game.map.players[playerIndex] = data;
      }
    },

    /**
     * On NPC movement, update NPCs
     */
    npcMovement(data) {
      if (this.game.npcs) {
        this.game.map.npcs = data;
        this.game.npcs = data;
      }
    },

    /**
     * Start the whole game
     */
    async startGame(data) {
      // Stop the main menu music
      bus.$emit('music:stop');

      // Start the Client
      this.game = new Client(data);
      await this.game.buildMap();

      // Start game engine
      const engine = new Engine(this.game);
      engine.start();

      // Focus on game.
      setTimeout(() => {
        window.focusOnGame();
      }, 250);

      // Clear login procedure
      bus.$emit('login:done');

      // Show the game canvas
      this.loaded = true;

      // Set screen to 'game' for chatbox reset
      this.screen = 'game';
    },
    /**
     * A click-handler event that does nothing, really.
     *
     * @param {MouseEvent} event The mouse event
     */
    nothing(event) {
      // Make right-click system for
      // rest of the game view.
      event.preventDefault();
    },
    sidebarClicked() {
      bus.$emit('contextmenu:close');
    },
    showSidebar(selectedSlot) {
      this.$refs.sidebarSlots.selected = selectedSlot;
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Roboto Slab", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;

  img.logo {
    margin-bottom: 1em;
  }

  div.login__screen {
    width: 692px;
    position: relative;
    border: 5px solid #ababab;
    box-sizing: border-box;
    display: flex;
    height: 505px;
    align-content: center;
    justify-content: center;
    background-image: url("./assets/bg-screen.png");

    div.server__down {
      font-size: 0.85em;
    }

    div.bg {
      background-color: rgba(0, 0, 0, 0.5);
      padding: 1em 0;
      border-radius: 5px;
      display: inline-flex;
      justify-content: space-around;
    }

    div.button_group {
      width: 100%;
      display: inline-flex;
      justify-content: space-around;

      button {
        background: #dedede;
        border: 2px solid darken(#dedede, 10%);
        font-size: 1.5em;
        cursor: pointer;
      }
    }
  }

  div.wrapper {
    background-color: #ababab;
    padding: 5px;
    display: grid;
    grid-template-columns: 512px auto;
    border-radius: 5px;

    div.right {
      display: flex;
      flex-direction: column;
      position: relative;
      justify-content: flex-end;

      div.content {
        background-color: #c7c7c7;
        height: 100px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">

    <!-- Login screen -->
    <div v-show="!loaded" class="wrapper login__screen">

      <div class="bg">
        <div v-if="screen === 'register'" class="register">
          To register an account, please visit <a href="https://navarra-rpg.com/register">this page</a> to get start and then come back.
        </div>
        <div v-if="screen === 'login'" class="login">
          <Login></Login>
        </div>
        <div class="button_group"  v-if="screen === 'main'">
          <button @click="screen = 'login'" class="login">
            Login
          </button>

          <button @click="screen = 'register'" class="register">
            Register
          </button>
        </div>
      </div>

    </div>

    <!-- Game wrapper -->
    <div class="wrapper" @click.right="nothing" v-show="loaded">
      <div class="left">

        <!-- Main canvas -->
        <GameCanvas :game="game" />

        <!-- Chatbox -->
        <Chatbox :game="game" />
      </div>
      <div class="right">
        <!-- Player overview -->
        <Info :game="game" />

        <!-- Slots (Stats, Wear, Inventory, etc.) -->
        <Slots :game="game" />
      </div>

      <context-menu :game="game"></context-menu>
    </div>
    <!-- End Game wrapper -->
  </div>
</template>

<script>
import GameCanvas from './components/GameCanvas';
import Chatbox from './components/Chatbox';
import Slots from './components/Slots';
import Info from './components/Info';

// Sub Vue components
import ContextMenu from './components/sub/ContextMenu';
import Login from './components/ui/Login';

import Client from './core/client';
import Engine from './core/engine';
import config from './core/config';

import Map from './core/map';

export default {
  name: 'navarra',
  components: {
    GameCanvas, Chatbox, Info, Slots, ContextMenu, Login,
  },
  created() {
    window.ws.on('login-data', data => this.startGame(data));
    window.ws.on('player:login', data => this.startGame(data));
  },
  data() {
    return {
      config,
      loaded: false,
      game: false,
      screen: 'login',
    };
  },
  methods: {
    async startGame(data) {
      this.game = new Client(data);
      const images = await this.game.start();
      this.game.map = new Map(data.map);
      this.game.map.setImages(images);
      this.game.map.setPlayer(data.player);
      this.game.map.setNPCs(data.npcs);

      // Start game engine
      const engine = new Engine(this.game);
      engine.start();

      // Focus mouse on the game-map
      document.querySelector('canvas#game-map').focus();

      this.loaded = true;
    },
    nothing(event) {
      // Make right-click system for
      // rest of the game view.
      event.preventDefault();
    },
  },
  async mounted() {
    // // Start game
    // this.game = new Game();
    // await this.game.start();
    // this.loaded = true;

    // // Start game engine
    // const engine = new Engine(this.game);
    // engine.start();

    // // Focus mouse on the game-map
    // document.querySelector('canvas#game-map').focus();
  },
};
</script>

<style lang="scss" scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css";

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
    border: 5px solid #ababab;
    box-sizing: border-box;
    display: flex;
    height: 505px;
    align-content: center;
    justify-content: center;
    background-image: url("./assets/bg-screen.png");
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

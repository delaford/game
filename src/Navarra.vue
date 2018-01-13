<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">

    <div class="wrapper" @click.right="nothing">
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
  </div>
</template>

<script>
import GameCanvas from './components/GameCanvas';
import Chatbox from './components/Chatbox';
import Slots from './components/Slots';
import Info from './components/Info';

// Sub Vue components
import ContextMenu from './components/sub/ContextMenu';

import Game from './core/game';
import Engine from './core/engine';
import config from './core/config';

export default {
  name: 'navarra',
  components: {
    GameCanvas, Chatbox, Info, Slots, ContextMenu,
  },
  data() {
    return {
      config,
      loaded: false,
      game: false,
    };
  },
  methods: {
    nothing(event) {
      // Make right-click system for
      // rest of the game view.
      event.preventDefault();
    },
  },
  async mounted() {
    // Start game
    this.game = new Game(this.config.assets);
    await this.game.start();
    this.loaded = true;

    // Start game engine
    const engine = new Engine(this.game);
    engine.start();

    // Focus mouse on the game-map
    document.querySelector('canvas#game-map').focus();
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

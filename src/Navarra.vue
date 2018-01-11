<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">

    <div class="wrapper">
      <Canvas :game="game" />
      <Chatbox :game="game"/>
    </div>
  </div>
</template>

<script>
import Canvas from './components/Canvas';
import Chatbox from './components/Chatbox';

import Game from './core/game';
import Engine from './core/engine';
import config from './core/config';

export default {
  name: 'navarra',
  components: {
    Canvas, Chatbox,
  },
  data() {
    return {
      config,
      loaded: false,
      game: false,
    };
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

  .wrapper {
    background-color: #ababab;
    padding: 5px;
  }
}
</style>

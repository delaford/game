<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">
    <Game/>
  </div>
</template>

<script>
import Game from './components/Game';

export default {
  name: 'navarra',
  components: {
    Game,
  },
};
</script>

<style lang="scss">
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
}

html {
  height: 100%;
  background-color: #655a5a;

  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>

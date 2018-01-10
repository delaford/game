<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">

    <div class="wrapper">
      <Game/>
      <Chatbox/>
    </div>
  </div>
</template>

<script>
import Game from './components/Game';
import Chatbox from './components/Chatbox';

export default {
  name: 'navarra',
  components: {
    Game, Chatbox,
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

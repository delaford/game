<template>
  <div id="app">
    <section class="logo">
      Navarra
    </section>
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
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
@import "//cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css";
@font-face {
  font-family: "MyWebFont";
  src: url("./assets/vcr_osd.ttf") format("truetype");
}
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

  section.logo {
    font-size: 3em;
  }
}

html {
  height: 100%;
  background-color: #655a5a;

  body {
    height: 100%;
    margin: 0;
    padding: 0;

    p {
      font-family: "MyWebFont", sans-serif;
    }
  }
}
</style>

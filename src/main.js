import Vue from 'vue';
import Navarra from './Navarra.vue';
import store from './store';

Vue.config.productionTip = false;

// Start the websocket server client-side
if ('WebSocket' in window) {
  // const hostname = window.location.hostname;
  if (window.location.href.includes('.com')) {
    const url = 'wss://play.navarra-rpg.com';
    console.log(`Connected to ${url}`);

    window.ws = new WebSocket(url);
  } else {
    window.ws = new WebSocket('ws://localhost:4000');
  }
}

// Add an event listener to close the websocket
// connection right before the browser closes.
window.addEventListener('beforeunload', () => window.ws.close());

// Focus mouse on game-canvas
window.focusOnGame = () => {
  document.querySelector('canvas#game-map.main-canvas').focus();
};

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(Navarra),
}).$mount('#navarra');

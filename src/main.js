// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Navarra from './Navarra';

Vue.config.productionTip = false;

// Start the websocket server client-side
if ('WebSocket' in window) {
  // const hostname = window.location.hostname;
  // const wsHost = location.origin.replace(/^http/, 'ws');
  // const tls = hostname.includes('localhost') ? 'ws' : 'wss';
  // const port = hostname.includes('localhost') ? '' : '';
  // const base = tls === 'ws' ? `localhost${port}` : (`${wsHost}/ws`);
  // const connectionURI = `${tls}://${base}`;
  if (window.location.href.includes('.com')) {
    const url = 'wss://navarra.herokuapp.com';
    console.log(`Connected to ${url}`);

    window.ws = new WebSocket(url);
  } else {
    window.ws = new WebSocket('ws://localhost:4000');
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#navarra',
  template: '<Navarra/>',
  components: { Navarra },
});

// Add an event listener to close the websocket
// connection right before the browser closes.
window.addEventListener('beforeunload', () => window.ws.close());

// Focus mouse on game-canvas
window.focusOnGame = () => {
  document.querySelector('canvas#game-map.main-canvas').focus();
};

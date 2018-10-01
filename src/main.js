import Vue from 'vue';
import VueTippy from 'vue-tippy';

import Delaford from './Delaford.vue';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueTippy, {
  animation: 'fade',
  inertia: true,
  size: 'small',
  theme: 'translucent',
  arrow: true,
  followCursor: true,
});

// Start the websocket server client-side
if ('WebSocket' in window) {
  // TODO
  // Clean this up
  // const hostname = window.location.hostname;
  const url = process.env.NODE_ENV === 'production' ? 'wss://play.delaford.com' : 'ws://localhost:4000';
  window.ws = new WebSocket(url);
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
  render: h => h(Delaford),
}).$mount('#delaford');

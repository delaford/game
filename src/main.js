// Core libraries
import Vue from 'vue';

// 3rd-party libraries
import VueTippy from 'vue-tippy';

// Import Delaford
import Delaford from './Delaford.vue';
import store from './store';

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== 'production';

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
  const url = process.env.NODE_ENV === 'production' ? 'wss://play.delaford.com' : `ws://${window.location.hostname}:4000`;
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

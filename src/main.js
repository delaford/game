// Core libraries
import Vue from 'vue';

// 3rd-party libraries
import VueTippy from 'vue-tippy';

// Import Delaford
import Delaford from './Delaford.vue';
import store from './store';


// Vue configuration
Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== 'production';

// Vue plugins
Vue.use(VueTippy, {
  animation: 'fade',
  inertia: true,
  size: 'small',
  theme: 'translucent',
  arrow: true,
  followCursor: true,
});

// Import game-panes
const files = require.context('./components/game-panes', true, /\.vue$/i);
const utilFiles = require.context('./components/util', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));
utilFiles.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], utilFiles(key).default));

// Start the websocket server client-side
if ('WebSocket' in window) {
  const wsurl = {
    prod: 'wss://play.delaford.com',
    dev: `ws://${window.location.hostname}:6500`,
  };

  const url = process.env.NODE_ENV === 'production' ? wsurl.prod : wsurl.dev;
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

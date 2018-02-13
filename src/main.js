// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import wsEvents from 'ws-events';
import Navarra from './Navarra';

Vue.config.productionTip = false;

// Start the websocket server client-side
window.ws = wsEvents(new WebSocket('ws://localhost:9000'));

/* eslint-disable no-new */
new Vue({
  el: '#navarra',
  template: '<Navarra/>',
  components: { Navarra },
});

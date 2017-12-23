// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Navarra from './Navarra';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#navarra',
  template: '<Navarra/>',
  components: { Navarra },
});

// Setup Vue bus *choo, choo*
window.events = new Vue();

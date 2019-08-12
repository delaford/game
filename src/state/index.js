import Vue from 'vue';
import Vuex from 'vuex';
import config from './config';

Vue.use(Vuex);
const store = new Vuex.Store(config);

store.subscribe(function (mutation, state) {
	/*case 'setMutation':

	break;*/
})

//store.dispatch('action');

export default store;

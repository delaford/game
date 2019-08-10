import Vuex from 'vuex'
import config from './config'

const store = new Vuex.Store(config);

store.subscribe(function (mutation, state) {
	/*case 'setMutation':

	break;*/
})

//store.dispatch('action');

export default store;
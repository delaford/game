import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
});

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    account: {
      username: '',
      password: '',
    },
    guestAccount: false,
    rememberMe: false,
    action: {
      label: '',
      object: '',
    },
  },
  getters: {
    account: state => state.account,
    action: state => state.action,
    guestAccount: state => state.guestAccount,
    rememberMe: state => state.rememberMe,
  },
  mutations: {
    REMEMBER_DEV_ACCOUNT: (state, payload) => {
      state.account.username = payload.username;
      state.account.password = payload.password;
    },
    SET_ACTION: (state, payload) => {
      state.action.label = payload.label;
      state.action.object = payload.object;
    },
    SET_REMEMBER_ME: (state, payload) => {
      state.rememberMe = payload;
    },
    SET_GUEST_ACCOUNT: (state, payload) => {
      state.guestAccount = payload;
    },
  },
  actions: {
    setAction: (context, payload) => {
      context.commit('SET_ACTION', payload);
    },
    setGuestAccount: (context, payload) => {
      context.commit('SET_GUEST_ACCOUNT', payload);
    },
    setRememberMe: (context, payload) => {
      context.commit('SET_REMEMBER_ME', payload);
    },
    rememberDevAccount: (context, payload) => {
      context.commit('REMEMBER_DEV_ACCOUNT', payload);
    },
  },
});

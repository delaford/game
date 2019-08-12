const actions = {
};
const mutations = {
  set_action: (state, payload) => {
    state.action.label = payload.label;
    state.action.object = payload.object;
  },
  set_screen: (state, payload) => {
    state.screen = payload;
  },
};
const getters = {
  action: state => state.action,
  screen: state => state.screen,
};

export default {
  actions,
  mutations,
  getters,
  state: {
    action: {
      label: '',
      object: '',
    },
    screen: 'login',
  },
};

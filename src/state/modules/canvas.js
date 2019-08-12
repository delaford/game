const actions = {
};
const mutations = {
  set_action: (state, payload) => {
    state.action.label = payload.label;
    state.action.object = payload.object;
  },
};
const getters = {
  action: state => state.action,
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
  },
};

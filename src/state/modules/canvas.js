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
  set_tile_coords: (state, payload) => {
    state.tileX = payload.x;
    state.tileY = payload.y;
  },
};
const getters = {
  action: state => state.action,
  screen: state => state.screen,
  tileX: state => state.tileX,
  tileY: state => state.tileY,
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
    tileX: 0,
    tileY: 0,
  },
};

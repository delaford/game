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
  set_map: (state, payload) => {
    state.map = payload;
  },
  set_npcs: (state, payload) => {
    state.npcs = payload;
  },
  set_player: (state, payload) => {
    state.player = payload;
  },
  set_droppedItems: (state, payload) => {
    state.droppedItems = payload;
  },
};
const getters = {
  action: state => state.action,
  screen: state => state.screen,
  tileX: state => state.tileX,
  tileY: state => state.tileY,
  map: state => state.map,
  npcs: state => state.npcs,
  player: state => state.player,
  droppedItems: state => state.droppedItems,
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
    map: undefined,
    npcs: undefined,
    player: undefined,
    droppedItems: undefined,
  },
};

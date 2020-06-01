import bus from '../../utilities/bus';


export default {
  /**
   * The bank updates
   */
  'core:bank:refresh': (data, context) => {
    context.game.player.bank = data.data.data;
  },

  'core:pane:close': () => {
    console.log('Closing pane...');
    bus.$emit('screen:close');
  },
};

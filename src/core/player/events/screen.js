export default {
  /**
   * The bank updates
   */
  'core:bank:refresh': (data, context) => {
    context.game.player.bank = data.data.data;
  },
};

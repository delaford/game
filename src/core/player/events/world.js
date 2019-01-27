export default {
  /**
   * The world receives an updated dropped items list
   */
  'world:itemDropped': (data, context) => {
    context.game.map.droppedItems = data.data;
  },

  'world:foreground:update': (data, context) => {
    context.game.map.foreground = data.data;
  },
};

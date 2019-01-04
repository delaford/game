export default {
  /**
   * The world receives an updated dropped items list
   */
  'world:itemDropped': (data, context) => {
    context.game.map.droppedItems = data.data;
  },
};


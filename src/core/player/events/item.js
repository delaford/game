// Item event handler

export default {
  /**
   * A player picks up or drops an item
   */
  'item:change': (data, context) => {
    context.game.map.droppedItems = data.data;
  },

  /**
   * A player recieves an item in their inventory
   */
  'core:refresh:inventory': (incoming, context) => {
    context.game.player.inventory = incoming.data.data;
  },
};

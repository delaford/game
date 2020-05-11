import { general, wearableItems, smithing } from '@server/core/data/items';

import { foregroundObjects } from '@server/core/data/foreground';

class Query {
  /**
   * Obtains the full information of a foreground object by its ID
   *
   * @param {integer} id The ID of the foreground item
   * @returns {object}
   */
  static getForegroundData(id) {
    return foregroundObjects
      .map((t) => {
        t.context = 'action';
        return t;
      })
      .find(item => item.id === id);
  }

  /**
   * Obtain the full information of an item by its ID on the server-side
   *
   * @param {integer} id The ID of the item
   * @returns {object}
   */
  static getItemData(id) {
    const allItems = [...wearableItems, ...general, ...smithing];
    return allItems
      .map((t) => {
        t.context = 'item';
        return t;
      })
      .find(item => item.id === id);
  }
}

export default Query;

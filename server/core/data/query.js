import { wearableItems } from 'root/core/data/items';
import { foregroundObjects } from 'root/core/data/foreground';

class Query {
  /**
   * Obtains the full information of a foreground object by its ID
   *
   * @param {integer} id The ID of the foreground item
   * @returns {object}
   */
  static getForegroundData(id) {
    return foregroundObjects.map((t) => {
      t.context = 'action';
      return t;
    }).find(item => item.id === id);
  }

  /**
   * Obtain the full information of an item by its ID from the socket event
   *
   * @param {integer} id The ID of the item
   * @returns {object}
   */
  static getItemData(id) {
    return wearableItems.map((t) => {
      t.context = 'item';
      return t;
    }).find(item => item.id === id);
  }
}

export default Query;

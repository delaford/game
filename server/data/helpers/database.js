class Database {
  /**
   * Load the correct tileset file via its name
   *
   * @param {string} name The filename where tileset loaded from
   * @returns {string}
   */
  static loadTileset(name) {
    let tileset = '';
    switch (name) {
      default:
      case 'weapons':
        tileset = 'weapons';
        break;
    }

    return tileset;
  }
  /**
   * Load actions from preset words
   *
   * @param {array} items List of presets
   * @return {array}
   */
  static presetActions(items) {
    const actions = [];
    let list = [];

    items.forEach((item) => {
      switch (item) {
        default:
          break;
        case 'wearable':
          list = [
            'take',
            'examine',
            'drop',
            'equip',
            'unequip',
          ];
          break;
        case 'axe':
          list = [
            'chop',
          ];
          break;
      }

      actions.push(...list);
    });


    return actions;
  }
}

module.exports = Database;


const other = () => false;

/**
 * Load actions from preset words
 *
 * @param {array} items List of presets
 * @return {array}
 */
const presetActions = (items) => {
  const actions = [];
  let list = [];

  // Which items have a list of already-needed actions?
  items.forEach((item) => {
    switch (item) {
      default:
        break;
      // Every wearable, you can
      // drop, examine, take, .etc.
      case 'wearable':
        list = [
          'take',
          'examine',
          'drop',
          'equip',
          'unequip',
          'deposit',
        ];
        break;
      case 'resource':
        list = [
          'take',
          'examine',
          'drop',
          'deposit',
        ];
        break;
      // Axes you can chop with
      case 'axe':
        list = [
          'chop',
        ];
        break;
      case 'pickaxe':
        list = [
          'mine',
          'examine',
        ];
    }

    actions.push(...list);
  });

  return actions;
};

export { presetActions, other };

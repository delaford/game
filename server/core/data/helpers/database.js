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
      list = [...item];
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
        'withdraw',
        'buy',
        'sell',
        'value',
      ];
      break;
    case 'resource':
      list = [
        'take',
        'examine',
        'drop',
        'deposit',
        'withdraw',
        'buy',
        'sell',
        'value',
      ];
      break;
      // Axes you can chop with
    case 'axe':
      list = ['chop'];
      break;
    case 'pickaxe':
      list = ['mine', 'examine'];
      break;
    case 'furnace':
      list = ['smelt', 'examine'];
      break;
    case 'anvil':
      list = ['smith', 'forge', 'examine'];
    }

    actions.push(...list);
  });

  return actions;
};

export { presetActions, other };

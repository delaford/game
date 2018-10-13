import weapons from './weapons';

const armor = require('./armor');

// Item and monster database
const wearableItems = [
  ...weapons,
  ...armor,
];

module.exports = {
  armor,
  weapons,
  wearableItems,
};

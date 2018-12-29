import weapons from './weapons';
import armor from './armor';
import jewelry from './jewelry';
import general from './general';

const wearableItems = [
  ...weapons,
  ...armor,
  ...jewelry,
];

export {
  armor,
  weapons,
  jewelry,
  general,
  wearableItems,
};

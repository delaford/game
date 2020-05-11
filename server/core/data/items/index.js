import weapons from './weapons';
import armor from './armor';
import jewelry from './jewelry';
import general from './general';

import smithing from './skills/smithing';

const wearableItems = [...weapons, ...armor, ...jewelry];

export {
  armor, weapons, jewelry, general, smithing, wearableItems,
};

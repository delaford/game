// Resources event handler

import bus from './../../utilities/bus';

export default {
  /**
   * Golden Plaque action result
   */
  'game:send:message': (data) => {
    bus.$emit('item:examine', { data: { type: 'normal', text: data.data.text } });
  },

  /**
   * Mine a rock
   */
  'player:resource:rock:mine': (data) => {
    debugger;
    // Show rock picking event going on...
    console.log(data);
  },
};


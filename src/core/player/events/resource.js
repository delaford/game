// Resources event handler

import bus from './../../utilities/bus';

export default {
  /**
   * Golden Plaque action result
   */
  'resource:push:goldenplaque': (data) => {
    bus.$emit('item:examine', { data: { type: 'normal', text: data.data.text } });
  },
};


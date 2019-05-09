// Resources event handler

import bus from '../../utilities/bus';

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
    // Show rock picking event going on...
    console.log(data);
  },

  /**
   * Update skills
   */
  'resource:skills:update': (incoming, context) => {
    context.game.player.skills = incoming.data.data;
  },
};

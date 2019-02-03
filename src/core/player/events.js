import playerEvents from './events/player';
import itemEvents from './events/item';
import resourceEvents from './events/resource';
import npcEvents from './events/npc';
import worldEvents from './events/world';
import screenEvents from './events/screen';

/**
 * A global event handler [CLIENT SIDE] (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */

// These are events that come from the server that
// will manipulate and change the client accordingly.
const handler = {
  ...playerEvents,
  ...itemEvents,
  ...resourceEvents,
  ...npcEvents,
  ...worldEvents,
  ...screenEvents,

  /**
   * Receive the data from the client upon browser open
   */
  'server:send:items': (data) => {
    window.allItems = data.data.items;
  },
};

export default handler;

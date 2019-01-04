import playerEvents from './events/player';
import itemEvents from './events/item';
import resourceEvents from './events/resource';
import npcEvents from './events/npc';
import worldEvents from './events/world';

/**
 * A global event handler [CLIENT SIDE] (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */

// TODO
// Break this file into separate folders/files so all
// of the events are not in one giant mega file.
const handler = {
  ...playerEvents,
  ...itemEvents,
  ...resourceEvents,
  ...npcEvents,
  ...worldEvents,

  /**
   * Receive the data from the client upon browser open
   */
  'server:send:items': (data) => {
    window.allItems = data.data.wearableItems;
  },
};

export default handler;

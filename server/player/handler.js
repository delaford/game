import actionEvents from './handlers/actions';
import socketEvents from './handlers/socket-events';

/**
 * A global event handler (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */
const Handler = {
  // Events like player login, say, queue action, etc.
  ...socketEvents,
  // Items from the context-menu.
  ...actionEvents,
};

export default Handler;

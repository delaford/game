import bus from './../utilities/bus';

/**
 * A global event handler [CLIENT SIDE] (RPC)
 *
 * @param {object} data The incoming event and data associated
 * @param {object} ws The Socket connection to incoming client
 * @param {object} context The server context
 */
const handler = {
  /**
   * A player logins into the game
   */
  'player:login': async (data, context) => {
    context.startGame(data.data);
  },
  /**
   * A player logins into the game
   */
  'player:login-error': (data) => {
    bus.$emit('player:login-error', data.data);
  },
  /**
   * When a player moves.
   */
  'player:movement': (data, context) => {
    context.playerMovement(data.data);
  },
  /**
   * A player saying something
   */
  'player:say': (data) => {
    bus.$emit('player:say', data.data);
  },
  /**
   * A player receives NPC movements
   */
  'npc:movement': (data, context) => {
    context.npcMovement(data.data);
  },
  /**
   * A player recieves new players
   */
  'player:joined': (data, context) => {
    setTimeout(() => {
      if (context.game.player) {
        context.game.map.players = data.data
          .filter(p => p.socket_id !== context.game.player.socket_id);
      }
    }, 1000);
  },
  /**
   * A player leaves the game
   */
  'player:left': (data, context) => {
    const playerIndex = context.game.map.players.findIndex(p => data.data === p.uuid);
    context.game.map.players.splice(playerIndex, 1);
  },

  /**
   * A player picks up or drops an item
   */
  'item:change': (data, context) => {
    context.game.map.droppedItems = data.data;
  },

  /**
   * A player recieves an item in their inventory
   */
  'item:pickup': (data, context) => {
    if (data.data.player.socket_id === context.game.player.socket_id) {
      context.game.player.inventory = data.data.data;
    }
  },

  /**
   * The world receives an updated dropped items list
   */
  'world:itemDropped': (data, context) => {
    context.game.map.droppedItems = data.data;
  },

  /**
   * A player equips an item
   */
  'player:equippedAnItem': (data, context) => {
    if (data.data.uuid === context.game.player.uuid) {
      context.game.player.inventory = data.data.inventory;
      context.game.player.wear = data.data.wear;
    }
  },

  /**
   * A player unequips an item
   */
  'player:unequippedAnItem': (data, context) => {
    if (data.data.uuid === context.game.player.uuid) {
      context.game.player.inventory = data.data.inventory;
      context.game.player.wear = data.data.wear;
    }
  },

  'game:receive:items': (data) => {
    bus.$emit('client:game:receive:items', data.data);
  },
};

export default handler;

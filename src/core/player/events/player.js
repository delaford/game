// Player event handler

import bus from '../../utilities/bus';

export default {
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
    data.data.inventory = data.data.inventory.slots;
    context.playerMovement(data.data);
  },
  /**
   * A player saying something
   */
  'player:say': (data) => {
    bus.$emit('player:say', data.data);
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
    const playerIndex = context.game.map.players.findIndex(p => data.data === p.socket_id);
    context.game.map.players.splice(playerIndex, 1);
  },


  /**
   * A player equips an item
   */
  'player:equippedAnItem': (data, context) => {
    if (data.data.uuid === context.game.player.uuid) {
      context.game.player.inventory = data.data.inventory.slots;
      context.game.player.wear = data.data.wear;
      context.game.player.combat = data.data.combat;
    }
  },

  /**
   * The player stopped moving
   */
  'player:stopped': () => {
    bus.$emit('canvas:getMouse');
  },

  /**
   * A player unequips an item
   */
  'player:unequippedAnItem': (data, context) => {
    if (data.data.uuid === context.game.player.uuid) {
      context.game.player.inventory = data.data.inventory.slots;
      context.game.player.wear = data.data.wear;
      context.game.player.combat = data.data.combat;
    }
  },
};

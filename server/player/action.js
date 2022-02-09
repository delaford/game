import UI from 'shared/ui';
import World from '@server/core/world';
import config from '@server/config';
import { merge } from 'lodash';
import Handler from './handler';
import playerEvent from './handlers/actions';

class Action {
  constructor(player, miscData) {
    // Player
    this.player = World.players.find(p => p.socket_id === player);

    // Map layers
    this.background = World.map.background;
    this.foreground = World.map.foreground;

    // Moving map objects (npcs, items, etc.)
    this.npcs = World.npcs;
    this.droppedItems = World.items;

    // Misc data (slots, etc)
    this.miscData = miscData;

    // On what tile?
    this.tile = false;
  }

  /**
   * Get the walkable tile status of all 4 corners of an action's tile
   *
   * @param {object} action The action being pursued
   * @param {integer} xy The x,y coordinates of action taking place
   * @returns {object}
   */
  getEdgeTiles(action, { x, y }) {
    if (action.nearby === 'edge') {
      const tiles = {
        up: UI.getTileOverMouse(
          this.background,
          this.player.x,
          this.player.y,
          x,
          y - 1,
        ),
        right: UI.getTileOverMouse(
          this.background,
          this.player.x,
          this.player.y,
          x + 1,
          y,
        ),
        down: UI.getTileOverMouse(
          this.background,
          this.player.x,
          this.player.y,
          x,
          y + 1,
        ),
        left: UI.getTileOverMouse(
          this.background,
          this.player.x,
          this.player.y,
          x - 1,
          y,
        ),
      };

      // How ugly is this? Stupid object iteration...
      // eslint-disable-next-line
      return Object.assign(...Object.entries(tiles).map(([key, value]) => ({[key]: UI.tileWalkable(value)})));
    }

    return false;
  }

  /**
   * Get the tile number the player clicked on
   *
   * @param {object} clickedOn The x,y the player clicked on
   */
  getTileNumber(clickedOn) {
    const { size, viewport } = config.map;
    const tileCrop = {
      x: this.player.x - Math.floor(0.5 * viewport.x),
      y: this.player.y - Math.floor(0.5 * viewport.y),
    };

    // eslint-disable-next-line
    const onTile = (((clickedOn.y + tileCrop.y) * size.x) + clickedOn.x) + tileCrop.x;
    this.tile = onTile;
  }

  /**
   * Execute the certain action by checking (if allowed)
   *
   * @param {object} data Information of tile, Action class and items
   * @param {object} queuedAction The action to take when a player reaches that tile
   */
  do(data, queuedAction = null) {
    const clickedTile = data.tile;
    const incomingAction = data.item.action;
    const doing = incomingAction.name.toLowerCase();

    this.getTileNumber(clickedTile);

    const tileWalkable = UI.tileWalkable(UI.getTileOverMouse(
      this.background,
      this.player.x,
      this.player.y,
      clickedTile.x,
      clickedTile.y,
    )); // TODO: Add foreground.

    // If the player clicked on himself make the action be immediate
    if (clickedTile.x === 7 && clickedTile.y === 5) {
      incomingAction.queueable = false;
      queuedAction.queueable = false;
    }

    // If an action needs to be performed
    // after a player reaches their destination
    if (queuedAction && queuedAction.queueable) {
      // Queue it up and tell the server.
      // IF already in queue... do not add it
      Handler['player:queueAction'](merge(queuedAction, {
        player: {
          socket_id: this.player.socket_id,
        },
        actionToQueue: {
          ...data.item.action,
          onTile: this.tile,
          coordinates: { x: clickedTile.x, y: clickedTile.y },
        },
      }));
    }

    // Object need to complete an action
    const dataObject = {
      clickedTile: data.tile,
      doing,
      tileWalkable,
      item: data.item || false,
      player: this.player,
      id: this.player.uuid,
      data: {
        miscData: this.miscData,
      },
      location: incomingAction.nearby,
      coordinates: { x: clickedTile.x, y: clickedTile.y },
    };

    // TODO
    // Refactor this as not every queueable
    // action will need 'player:mouseTo' before it
    const iminimentAction = incomingAction.queueable ? 'player:mouseTo' : incomingAction.actionId;

    // No action? Do nothing. (eg: Cancel)
    if (!iminimentAction) return;

    playerEvent[iminimentAction](dataObject);
  }
}

export default Action;

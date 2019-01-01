import UI from 'shared/ui';
import { merge } from 'lodash';
import Socket from '../socket';
import world from './world';
import Handler from '../player/handler';

class Action {
  constructor(player, miscData) {
    // Player
    this.player = world.players.find(p => p.socket_id === player);

    // Map layers
    this.background = world.map.background;
    this.foreground = world.map.foreground;

    // Moving map objects (npcs, items, etc.)
    this.npcs = world.npcs;
    this.droppedItems = world.items;

    // Misc data (slots, etc)
    this.miscData = miscData;
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
      return Object.assign(...Object.entries(tiles).map(([key, value]) => ({ [key]: UI.tileWalkable(value) })));
    }

    return false;
  }

  /**
   * Execute the certain action by checking (if allowed)
   *
   * @param {object} data Information of tile, Action class and items
   * @param {object} queuedAction The action to take when a player reaches that tile
   */
  do(data, queuedAction = null) {
    const { item } = data;
    const clickedTile = data.tile;
    const doing = item.action.name.toLowerCase();

    const tile = UI.getTileOverMouse(
      this.background,
      this.player.x,
      this.player.y,
      clickedTile.x,
      clickedTile.y,
    );

    const tileWalkable = UI.tileWalkable(tile); // TODO: Add foreground.

    // If an action needs to be performed
    // after a player reaches their destination
    if (queuedAction && queuedAction.queueable) {
      const queuedActionSocket = merge(queuedAction, {
        player: {
          socket_id: this.player.socket_id,
        },
      });

      // Queue it up and tell the server.
      Handler['player:queueAction'](queuedActionSocket);
    }

    switch (doing) {
      case 'walk-here':
        if (tileWalkable) {
          Handler['player:mouseTo']({
            data: {
              id: this.player.uuid,
              coordinates: { x: clickedTile.x, y: clickedTile.y },
            },
            player: {
              socket_id: this.player.uuid,
            },
          });
        }
        break;

      case 'examine':
        Socket.emit('CHAT:MESSAGE', {
          data: { type: 'normal', text: data.item.examine },
          player: {
            socket_id: this.player.socket_id,
          },
        });
        break;

      case 'equip':
        const itemEquipping = this.player.inventory.find(s => s.slot === this.miscData.slot);

        Handler['item:equip']({
          id: this.player.uuid,
          data: {
            item: {
              id: itemEquipping.id,
              uuid: itemEquipping.uuid,
              slot: this.miscData.slot,
            },
          },
        });
        break;

      case 'unequip':
        const itemUnequipping = this.player.wear[this.miscData.slot];

        Handler['item:unequip']({
          id: this.player.uuid,
          data: {
            item: {
              id: itemUnequipping.id,
              uuid: itemUnequipping.uuid,
              slot: this.miscData.slot,
            },
          },
        });
        break;

      case 'drop':
        const itemDropping = this.player.inventory.find(s => s.slot === this.miscData.slot);

        Handler['player:inventoryItemDrop']({
          id: this.player.uuid,
          data: {
            item: {
              id: data.item.id,
              slot: data.item.miscData.slot,
              uuid: itemDropping.uuid,
            },
          },
        });

        break;

      case 'take':
        if (tileWalkable) {
          Handler['player:mouseTo']({
            data: {
              id: this.player.uuid,
              coordinates: { x: clickedTile.x, y: clickedTile.y },
            },
            player: {
              socket_id: this.player.uuid,
            },
          });
        }

        break;

      case 'push':
        this.player.action = {
          ...data.item.action,
          coordinates: { x: clickedTile.x, y: clickedTile.y },
        };

        Handler['player:mouseTo']({
          data: {
            coordinates: { x: clickedTile.x, y: clickedTile.y },
            id: this.player.uuid,
            location: data.item.action.nearby,
          },
          player: {
            socket_id: this.player.uuid,
          },
        });


        break;

      default:
      case 'cancel':
        break;
    }
  }
}

export default Action;

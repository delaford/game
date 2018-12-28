import UI from 'shared/ui';
import { merge } from 'lodash';
import Socket from '../socket';
import world from './world';
import Handler from '../player/handler';

class Action {
  constructor(player) {
    // Player
    this.player = world.players.find(p => p.socket_id === player);

    // Map layers
    this.background = world.map.background;
    this.foreground = world.map.foreground;

    // Moving map objects (npcs, items, etc.)
    this.npcs = world.npcs;
    this.droppedItems = world.items;
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
      Socket.emit('player:queueAction', queuedActionSocket);
    }

    switch (doing) {
      // eslint-disable-next-line no-case-declarations
      case 'walk-here':
        // eslint-disable-next-line

        if (tileWalkable) {
          const coordinates = { x: clickedTile.x, y: clickedTile.y };

          const outgoingData = {
            data: {
              id: this.player.uuid,
              coordinates,
            },
            player: {
              socket_id: this.player.uuid,
            },
          };

          Handler['player:mouseTo'](outgoingData);
        }
        break;

      // eslint-disable-next-line no-case-declarations
      case 'examine':
        Socket.emit('CHAT:MESSAGE', {
          data: { type: 'normal', text: data.item.examine },
          player: {
            socket_id: this.player.socket_id,
          },
        });
        break;

      case 'equip':
        Socket.emit('item:equip', {
          id: this.player.uuid,
          item: {
            id: data.item.id,
            uuid: data.item.uuid,
            slot: this.miscData.slot,
          },
        });
        break;

      case 'unequip':
        Socket.emit('item:unequip', {
          id: this.player.uuid,
          item: {
            id: data.item.id,
            uuid: data.item.uuid,
            slot: this.miscData.slot,
          },
        });
        break;

      case 'drop':
        Socket.emit('player:inventoryItemDrop', {
          id: this.player.uuid,
          item: {
            id: data.item.id,
            slot: data.item.miscData.slot,
            uuid: data.item.uuid,
          },
        });

        break;

      case 'take':
        if (tileWalkable) {
          const outgoingDataT = {
            id: this.player.uuid,
            coordinates: { x: clickedTile.x, y: clickedTile.y },
          };

          Socket.emit('player:mouseTo', outgoingDataT);
        }

        break;

      default:
      case 'cancel':
        break;
    }
  }
}

export default Action;

import UI from 'shared/ui';
import { merge } from 'lodash';
import bus from '../utilities/bus';
import config from '../../../config';
import Socket from '../../core/utilities/socket';

class Actions {
  constructor(data, tile, event, miscData) {
    this.player = data.player;
    this.event = event;
    this.background = data.background;
    this.foreground = data.foreground;
    this.npcs = data.npcs;
    this.droppedItems = data.map.droppedItems;

    // Viewport X,Y coordinates
    this.clicked = {
      x: tile.x,
      y: tile.y,
    };

    // Data relevant to the context
    this.miscData = miscData;

    // Coordinates on map where clicked
    this.coordinates = {
      x: (this.player.x - config.map.player.x) + this.clicked.x,
      y: (this.player.y - config.map.player.y) + this.clicked.y,
    };

    // Player coordinates
    this.playerCoordinates = {
      x: this.player.x,
      y: this.player.y,
    };

    this.foregroundObjects = this.getForegroundObjects();

    this.objectId = null;
  }

  /**
   * Look into the foreground for objects
   */
  getForegroundObjects() {
    const obj = this.foreground
      .filter(t => t > 0)
      .map(t => t - 252 - (1));
    console.log(obj);
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
            id: this.player.uuid,
            coordinates,
          };

          Socket.emit('player:mouseTo', outgoingData);
        }
        break;

      // eslint-disable-next-line no-case-declarations
      case 'examine':
        bus.$emit('CHAT:MESSAGE', { type: 'normal', text: data.item.examine });

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

export default Actions;

import { merge } from 'lodash';
import bus from '../utilities/bus';
import UI from '../utilities/ui';
import { map } from '../config';
import Socket from '../../core/utilities/socket';
import actionList from './data/actions';

class Actions {
  constructor(data, tile, event, miscData) {
    this.player = data.player;
    this.event = event;
    this.background = data.background;
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
      x: (this.player.x - map.player.x) + this.clicked.x,
      y: (this.player.y - map.player.y) + this.clicked.y,
    };

    // this.color = config.map.color.item;

    this.playerCoordinates = {
      x: this.player.x,
      y: this.player.y,
    };

    this.objectId = null;
  }

  /**
   * Execute the certain action by checking (if allowed)
   *
   * @param {object} data Information of tile, Action class and items
   * @param {object} queuedAction The action to take when a player reaches that tile
   */
  do(data, queuedAction = null) {
    const item = data.item;
    const clickedTile = data.tile;
    const doing = item.action.name.toLowerCase();

    const tile = UI.getTileOverMouse(
      this.background,
      this.player.x,
      this.player.y,
      clickedTile.x,
      clickedTile.y);
    const tileWalkable = UI.tileWalkable(tile); // TODO: Add foreground.

    // If an action needs to be performed
    // after a player reaches their destination
    if (queuedAction) {
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
          item: data.item.id,
          slot: this.miscData.slot,
        });
        break;

      case 'drop':
        Socket.emit('player:inventoryItemDrop', {
          id: this.player.uuid,
          droppingItem: data.item.id,
          slot: data.item.miscData.slot,
        });

        break;

      case 'take':
        if (tileWalkable) {
          const outgoingData = {
            id: this.player.uuid,
            coordinates: { x: clickedTile.x, y: clickedTile.y },
          };

          Socket.emit('player:mouseTo', outgoingData);
        }

        break;

      default:
      case 'cancel':
        break;
    }
  }
  /**
   * Build the context-menu list items
   */
  build() {
    const self = this;

    return new Promise((resolve) => {
      let list = 0;
      const generateList = this.generateList();
      let actionableItems = [];
      const items = [];

      do {
        const action = generateList[list];
        actionableItems = self.check(action, items);
        list += 1;
      } while (list < generateList.length);

      resolve(actionableItems);
    }, this);
  }

  allow(action) {
    console.log(action);

    if (action.allow instanceof Boolean) {
      // Allow on actual context
      return true;
    }

    // eslint-disable-next-line
    const getItems = this.droppedItems.filter(item => item.x === this.coordinates.x && item.y === this.coordinates.y);

    // eslint-disable-next-line
    const getNPCs = this.npcs.filter(npc => npc.x === this.coordinates.x && npc.y === this.coordinates.y);

    return new Promise((resolve) => {
      const data = null;
      resolve(data);
    });
  }

  /**
   * Check to see if the list item is needed in list
   *
   * @param {string} action The item being checked
   */
  async check(action, items) {
    // const itemInView = await this.allow(action);
    // console.log(itemInView);

    // eslint-disable-next-line
    const getItems = this.droppedItems.filter(item => item.x === this.coordinates.x && item.y === this.coordinates.y);

    // eslint-disable-next-line
    const getNPCs = this.npcs.filter(npc => npc.x === this.coordinates.x && npc.y === this.coordinates.y);


    switch (action.name) {
      default:
        return false;
      // eslint-disable-next-line no-case-declarations
      case 'Take':
        getItems.forEach((item) => {
          const itemData = Object.assign(item, UI.getItemData(item.id));

          if (itemData.actions.includes(action.name.toLowerCase())) {
            const object = {
              label: `Take <span style='color:${this.color}'>${itemData.name}</span>`,
              action,
              type: 'item',
              at: {
                x: itemData.x,
                y: itemData.y,
              },
              id: itemData.id,
            };

            items.push(object);
          }
        });
        break;

      case 'Drop':
        if (this.clickedOn('inventorySlot')) {
          if (Actions.hasProp(this.miscData, 'slot')) {
            const itemData = UI.getItemData(this.player.inventory[this.miscData.slot].itemID);
            this.objectId = itemData;

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Drop <span style='color:${this.color}'>${itemData.name}</span>`,
                action,
                type: 'item',
                miscData: this.miscData,
                id: itemData.id,
              };

              items.push(object);
            }
          }
        }
        break;

      case 'Equip':
        if (this.clickedOn('inventorySlot')) {
          if (Actions.hasProp(this.miscData, 'slot')) {
            const itemData = UI.getItemData(this.player.inventory[this.miscData.slot].itemID);
            this.objectId = itemData;

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Equip <span style='color:${this.color}'>${itemData.name}</span>`,
                action,
                type: 'item',
                miscData: this.miscData,
                id: itemData.id,
              };

              items.push(object);
            }
          }
        }
        break;

      case 'Walk here':
        items.push({
          action: {
            name: 'walk-here',
          },
          label: 'Walk here',
        });

        break;

      // eslint-disable-next-line no-case-declarations
      case 'Examine':

        if (this.clickedOn('gameMap')) {
          getNPCs.forEach((npc) => {
            if (npc.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Examine <span style='color:${this.color}'>${npc.name}</span>`,
                action,
                examine: npc.examine,
                type: 'npc',
                id: npc.id,
              };

              items.push(object);
            }
          });

          getItems.forEach((item) => {
            const itemData = Object.assign(item, UI.getItemData(item.id));

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Examine <span style='color:${this.color}'>${itemData.name}</span>`,
                action,
                examine: itemData.examine,
                type: 'item',
                id: itemData.id,
              };

              items.push(object);
            }
          });
        }

        if (this.clickedOn('inventorySlot')) {
          if (Actions.hasProp(this.miscData, 'slot')) {
            const itemData = UI.getItemData(this.player.inventory[this.miscData.slot].itemID);
            this.objectId = itemData;

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Examine <span style='color:${this.color}'>${itemData.name}</span>`,
                action,
                examine: itemData.examine,
                type: 'item',
                id: itemData.id,
              };

              items.push(object);
            }
          }
        }
        break;
    }

    return items;
  }

  /**
   * The list of actionable items that can appear
   *
   * @returns {array}
   */
  generateList() {
    const list = actionList;

    return list.filter(a => a.context.some(b => [...this.event.target.classList].includes(b)));
  }

  clickedOn(target) {
    return this.event.target.className.includes(target);
  }

  static hasProp(object, name) {
    return Object.prototype.hasOwnProperty.call(object, name);
  }
}

export default Actions;

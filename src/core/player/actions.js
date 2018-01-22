import bus from '../utilities/bus';
import UI from '../utilities/ui';
import { map } from '../config';

class Actions {
  constructor(data, tile) {
    this.player = data.player;
    this.background = data.background;
    this.npcs = data.npcs;
    this.droppedItems = data.map.droppedItems;

    // Viewport X,Y coordinates
    this.clicked = {
      x: tile.x,
      y: tile.y,
    };

    // Coordinates on map where clicked
    this.coordinates = {
      x: (this.player.x - map.player.x) + this.clicked.x,
      y: (this.player.y - map.player.y) + this.clicked.y,
    };

    // Label color
    this.color = {
      Examine: '#EBE04D',
      Take: '#ffa619',
    };
  }

  /**
   * Execute the certain action by checking (if allowed)
   *
   * @param {object} data Information of tile, Action class and items
   */
  do(data) {
    const player = this.player;
    const board = this.background;
    const item = data.item;
    const clickedTile = data.tile;
    const doing = item.action.toLowerCase();

    const tile = UI.getTileOverMouse(board, player.x, player.y, clickedTile.x, clickedTile.y);
    const tileWalkable = UI.tileWalkable(tile); // TODO: Add foreground.

    switch (doing) {
      // eslint-disable-next-line no-case-declarations
      case 'walk-here':
        // eslint-disable-next-line

        if (tileWalkable) {
          const coordinates = { x: clickedTile.x, y: clickedTile.y };
          bus.$emit('PLAYER:MOVE', coordinates);
        }
        break;

      // eslint-disable-next-line no-case-declarations
      case 'examine':
        const getData = () => {
          switch (data.item.type) {
            default:
              return null;

            case 'npc':
              return this.npcs;

            case 'item':
              return this.droppedItems;
          }
        };

        const context = getData().find(npc => npc.id === data.item.id);
        bus.$emit('CHAT:MESSAGE', { type: 'normal', text: context.examine });
        // TODO: Add this to the text-box.
        break;

      case 'take':
        if (tileWalkable) {
          const coordinates = { x: clickedTile.x, y: clickedTile.y };
          bus.$emit('PLAYER:MOVE', coordinates);

          // TODO .. Actually pick up the item.
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
      const allActions = Actions.list();
      let actionableItems = [];
      const items = [];

      do {
        const action = allActions[list];
        actionableItems = self.check(action, items);
        list += 1;
      } while (list < allActions.length);

      resolve(actionableItems);
    }, this);
  }

  /**
   * Check to see if the list item is needed in list
   *
   * @param {string} action The item being checked
   */
  check(action, items) {
    // eslint-disable-next-line
    const getItems = this.droppedItems.filter(item => item.x === this.coordinates.x && item.y === this.coordinates.y);

    // eslint-disable-next-line
    const getNPCs = this.npcs.filter(npc => npc.x === this.coordinates.x && npc.y === this.coordinates.y);

    switch (action) {
      default:
        return false;
      // eslint-disable-next-line no-case-declarations
      case 'Take':
        getItems.forEach((item) => {
          const itemData = Object.assign(item, UI.getItemData(item.id));

          if (itemData.actions.includes(action.toLowerCase())) {
            const object = {
              label: `${action} <span style='color:${this.color[action]}'>${itemData.name}</span>`,
              action,
              type: 'item',
              id: itemData.id,
            };

            items.push(object);
          }
        });

        return items;

      // eslint-disable-next-line no-case-declarations
      case 'Examine':
        getNPCs.forEach((npc) => {
          if (npc.actions.includes(action.toLowerCase())) {
            const object = {
              label: `${action} <span style='color:${this.color[action]}'>${npc.name}</span>`,
              action,
              type: 'npc',
              id: npc.id,
            };

            items.push(object);
          }
        });

        getItems.forEach((item) => {
          const itemData = Object.assign(item, UI.getItemData(item.id));

          if (itemData.actions.includes(action.toLowerCase())) {
            const object = {
              label: `Examine <span style='color:${this.color[action]}'>${itemData.name}</span>`,
              action,
              type: 'item',
              id: itemData.id,
            };

            items.push(object);
          }
        });

        return items;
    }
  }

  /**
   * The list of actionable items that can appear
   *
   * @returns {array}
   */
  static list() {
    return [
      'Take',
      'Examine',
    ];
  }
}

export default Actions;

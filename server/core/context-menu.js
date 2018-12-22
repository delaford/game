import config from '../core/config';
import actionList from './data/action-list';
import world from './world';
import UI from '../core/utilities/ui';

class ContextMenu {
  constructor(player, tile, miscData) {
    // Player
    this.player = world.players.find(p => p.socket_id === player.socket_id);

    // Map layers
    this.background = world.map.background;
    this.foreground = world.map.foreground;

    // Moving map objects (npcs, items, etc.)
    this.npcs = world.npcs;
    this.droppedItems = world.items;

    // Element clicked on
    this.context = Object.values(miscData.clickedOn);

    // Coordinates of mouse-click and player
    this.coordinates = {
      // Where player is currently
      player: {
        x: this.player.x,
        y: this.player.y,
      },
      // Where on map they clicked on
      map: {
        x: (this.player.x - config.map.player.x) + tile.x,
        y: (this.player.y - config.map.player.y) + tile.y,
      },
      // Where in viewport they clicked on
      viewport: {
        x: tile.x,
        y: tile.y,
      },
    };

    // Data relevant to the context
    this.miscData = miscData;

    // this.foregroundObjects = this.getForegroundObjects();

    // this.objectId = null;
  }

  /**
   * Build the context-menu list items
   *
   * @returns {promise}
   */
  build() {
    const self = this;

    return new Promise((resolve) => {
      let list = 0;
      const generateList = this.generateList();
      const items = [];

      do {
        const action = generateList[list];
        self.check(action, items);
        list += 1;
      } while (list < generateList.length);

      resolve(items);
    }, this);
  }

  /**
   * Check to see if the list item is needed in list
   *
   * @param {string} action The item being checked
   * @returns {boolean}
   */
  async check(action, items) {
    const getItems = this.droppedItems
      .filter(item => item.x === this.coordinates.map.x && item.y === this.coordinates.map.y);

    const getNPCs = this.npcs
      .filter(npc => npc.x === this.coordinates.map.x && npc.y === this.coordinates.map.y);

    switch (action.name) {
      default:
        return items;
      case 'Walk here':
        items.push({
          action: {
            name: 'walk-here',
            weight: 2,
          },
          label: 'Walk here',
        });

        break;

      case 'Examine':

        if (this.clickedOn('gameMap')) {
          getNPCs.forEach((npc) => {
            if (npc.actions.includes(action.name.toLowerCase())) {
              const color = UI.getContextSubjectColor('npc');
              const object = {
                label: `Examine <span style='color:${color}'>${npc.name}</span>`,
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
            const color = UI.getContextSubjectColor('item');

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Examine <span style='color:${color}'>${itemData.name}</span>`,
                action,
                examine: itemData.examine,
                type: 'item',
                id: itemData.id,
                timestamp: itemData.timestamp,
              };

              items.push(object);
            }
          });
        }

        if (this.clickedOn('inventorySlot')) {
          if (ContextMenu.hasProp(this.miscData, 'slot')) {
            // eslint-disable-next-line
            const itemData = UI.getItemData(this.player.inventory.find(s => s.slot === this.miscData.slot).id);
            this.objectId = itemData;
            const color = UI.getContextSubjectColor('item');

            if (itemData.actions.includes(action.name.toLowerCase())) {
              const object = {
                label: `Examine <span style='color:${color}'>${itemData.name}</span>`,
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

    return list.filter(a => a.context.some(b => this.context.includes(b)));
  }

  /**
   * See if incoming data has a certain object data
   *
   * @param {string} object The payload of the incoming menu item
   * @param {string} name The name of the objeect property we check for
   * @returns {boolean}
   */
  static hasProp(object, name) {
    return Object.prototype.hasOwnProperty.call(object, name);
  }

  /**
   * See if the action allows to be clicked on from an appropriate class
   *
   * @param {object} target The element we are clicking on
   * @returns {boolean}
   */
  clickedOn(target) {
    return this.context.includes(target);
  }
}

export default ContextMenu;

import UI from 'shared/ui';
import config from '../../config';
import actionList from './data/action-list';
import world from './world';

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
      .filter(item => item.x === this.coordinates.map.x && item.y === this.coordinates.map.y)
      .map((i) => {
        i.context = 'item';
        return i;
      });

    const getNPCs = this.npcs
      .filter(npc => npc.x === this.coordinates.map.x && npc.y === this.coordinates.map.y)
      .map((i) => {
        i.context = 'npc';
        return i;
      });

    // Foreground
    const foregroundTile = UI.getTileOverMouse(
      this.foreground,
      this.coordinates.player.x,
      this.coordinates.player.y,
      this.coordinates.viewport.x,
      this.coordinates.viewport.y,
      'foreground',
    );

    const foregroundData = UI.getForegroundData(foregroundTile);

    // Action on item (Equip, Drop, Unequip, etc.)
    const itemActedOn = this.player.inventory.find(s => s.slot === this.miscData.slot);

    // Context menu list center
    switch (action.name) {
      default:
        return items;

      // Walk player to this location
      case 'Walk here':
        items.push({
          action: {
            name: 'walk-here',
            weight: 2,
          },
          label: 'Walk here',
        });

        break;

      // Drop item from inventory
      case 'Drop':
        if (this.clickedOn('inventorySlot')) {
          if (this.isFromInventory()) {
            const {
              actions, name, context, uuid, id,
            } = UI.getItemData(itemActedOn.id);

            const color = UI.getContextSubjectColor(context);

            if (ContextMenu.canDoAction(actions, action)) {
              items.push({
                label: `Drop <span style='color:${color}'>${name}</span>`,
                action,
                type: 'item',
                miscData: this.miscData,
                uuid,
                id,
              });
            }
          }
        }
        break;

      // Take item from floor
      case 'Take':
        getItems.forEach((item) => {
          const {
            actions, name, x, y, id, uuid, timestamp,
          } = Object.assign(item, UI.getItemData(item.id));

          const color = UI.getContextSubjectColor(item.context);

          if (ContextMenu.canDoAction(actions, action)) {
            items.push({
              label: `Take <span style='color:${color}'>${name}</span>`,
              action,
              type: 'item',
              at: {
                x,
                y,
              },
              id,
              uuid,
              timestamp,
            });
          }
        });
        break;

      // Equip item from inventory
      case 'Equip':
        if (this.clickedOn('inventorySlot') && this.isFromInventory()) {
          const {
            actions, context, name, uuid, id,
          } = UI.getItemData(itemActedOn.id);

          const color = UI.getContextSubjectColor(context);

          if (ContextMenu.canDoAction(actions, action)) {
            items.push({
              label: `Equip <span style='color:${color}'>${name}</span>`,
              action,
              type: 'item',
              miscData: this.miscData,
              uuid,
              id,
            });
          }
        }
        break;

      // Unequip item from the equipment screen
      case 'Unequip':
        if (this.clickedOn('wearSlot') && this.isFromInventory()) {
          const {
            name, actions, context, id,
          } = UI.getItemData(this.player.wear[this.miscData.slot].id);

          const color = UI.getContextSubjectColor(context);

          if (ContextMenu.canDoAction(actions, action)) {
            items.push({
              label: `Unequip <span style='color:${color}'>${name}</span>`,
              action,
              type: 'item',
              miscData: this.miscData,
              id,
            });
          }
        }
        break;

      // Examine item/object/npc from where possible
      case 'Examine':
        if (this.isFromGameCanvas()) {
          getNPCs.forEach(({
            actions, name, context, examine, id,
          }) => {
            if (ContextMenu.canDoAction(actions, action)) {
              const color = UI.getContextSubjectColor(context);
              items.push({
                label: `Examine <span style='color:${color}'>${name}</span>`,
                action,
                examine,
                type: 'npc',
                id,
              });
            }
          });

          getItems.forEach((item) => {
            const {
              name, examine, id, actions, timestamp,
            } = Object.assign(item, UI.getItemData(item.id));

            const color = UI.getContextSubjectColor(item.context);

            if (ContextMenu.canDoAction(actions, action)) {
              items.push({
                label: `Examine <span style='color:${color}'>${name}</span>`,
                action,
                examine,
                type: 'item',
                id,
                timestamp,
              });
            }
          });
        }

        if (this.isFromInventory()) {
          const {
            name, examine, id, context, actions,
          } = UI.getItemData(itemActedOn.id);

          const color = UI.getContextSubjectColor(context);

          if (ContextMenu.canDoAction(actions, action)) {
            items.push({
              label: `Examine <span style='color:${color}'>${name}</span>`,
              action,
              examine,
              type: 'item',
              id,
            });
          }
        }
        break;

      // Mine rocks
      case 'Mine':
        if (foregroundData && ContextMenu.canDoAction(foregroundData, action)) {
          const color = UI.getContextSubjectColor(foregroundData.context);
          items.push({
            label: `Mine <span style='color:${color}'>${foregroundData.name}</span>`,
            action,
            type: 'mine',
            at: {
              x: this.coordinates.viewport.x,
              y: this.coordinates.viewport.y,
            },
            id: foregroundData.id,
          });
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

  /**
   * Check to see if the context-menu invocation came from the player's inventory
   *
   * @returns {boolean}
   */
  isFromInventory() {
    return ContextMenu.hasProp(this.miscData, 'slot');
  }

  /**
   * Checks to see if context-menu invocation came from the game screen
   *
   * @returns {boolean}
   */
  isFromGameCanvas() {
    return this.clickedOn('gameMap');
  }

  /**
   * Checks to see if an action can be acted upon with the item or subject
   *
   * @example 'Does a pickaxe include an action of "Mine"?'
   * @param {object} item The item being checked
   * @param {object} action The action being checked
   * @returns {boolean}
   */
  static canDoAction(item, action) {
    if (item instanceof Array) {
      return item.includes(action.name.toLowerCase());
    }

    return item.actions.includes(action.name.toLowerCase());
  }
}

export default ContextMenu;

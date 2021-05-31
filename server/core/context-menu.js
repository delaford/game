import Config from '@server/config';
import UI from 'shared/ui';
import Query from './data/query';
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
    this.shops = world.shops;

    // Only generate the first item?
    this.firstOnly = miscData.firstOnly || false;

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
        x: this.player.x - Config.map.player.x + tile.x,
        y: this.player.y - Config.map.player.y + tile.y,
      },
      // Where in viewport they clicked on
      viewport: {
        x: tile.x,
        y: tile.y,
      },
    };

    // Are they on any pane?
    this.currentPane = this.player.currentPane;

    // For screens not managed by shops, banks or inventories.
    this.currentPaneData = this.player.currentPaneData;

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

      items
        .sort((a, b) => b.timestamp - a.timestamp)
        .sort((a, b) => a.action.weight - b.action.weight);

      if (this.miscData.firstOnly) {
        resolve({
          firstItem: items[0],
          count: items.length - 1,
        });
      }

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
      .filter(
        item => item.x < this.player.x + 7 && item.x > this.player.x - 10,
      )
      .filter(
        item => item.y < this.player.y + 7 && item.y > this.player.y - 10,
      )
      .filter(
        item => item.x === this.coordinates.map.x && item.y === this.coordinates.map.y,
      )
      .map((i) => {
        i.context = 'item';
        return i;
      });

    const getNPCs = this.npcs
      .filter(
        npc => npc.x === this.coordinates.map.x && npc.y === this.coordinates.map.y,
      )
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

    const foregroundData = Query.getForegroundData(foregroundTile);

    // Action on item (Equip, Drop, Unequip, etc.)
    const itemSource = {
      inventorySlot: this.player.inventory.slots,
      bankSlot: this.player.bank,
      shopSlot: this.getShopInventory(),
    };

    // From where are we getting our data from?
    // If we clicked on 'inventorySlot', then obviously player.inventory
    // if we clicked on 'bankSlot', then player.bank and so on.
    /* eslint-disable */
    // Either my neovim config is screwy or I'm lazy. It's 2:49 AM and this is too much.
    // TODO
    // Make the context automatically find which slot the click came from
    const itemsToSearch =
      itemSource[this.context[3]] ||
      this.currentPaneData ||
      this.player.inventory.slots;
    let itemActedOn =
      itemsToSearch.find((s) => s.slot === this.miscData.slot) ||
      itemsToSearch[this.miscData.slot];
    /* eslint-enable */

    if (typeof itemActedOn === 'object') {
      // The only time an item is an object is it comes from an inventory, bank,
      // or shop because those items are dynamic and have other data attached
      // to them (qty, value, etc.)
      itemActedOn = itemActedOn.id;
    }

    // Context menu list center
    /**
     * TODO
     * I know there is a MUCH better way to abstract
     * this switch-case code below to more simpler methods.
     */

    // TODO
    // Can definitely be abstracted out to something
    // such as "Panes" with items that show on different panes
    // that come with different requirements (ie: furnace view, cooking, smithing, etc.)
    if (!action) return;
    // TODO
    // SWITCH TO USING actionId?
    switch (action.actionId) {
    default:
    case 'Cancel':
      break;

      // Walk player to this location
    case 'player:walk-here':
      // Do not add WALK HERE if foreground tile is blocked
      items.push({
        action,
        label: action.name,
      });

      break;

      // Drop item from inventory
    case 'player:inventory-drop':
      if (this.clickedOn('inventorySlot')) {
        if (this.isFromInventory()) {
          const {
            actions, name, context, uuid, id,
          } = Query.getItemData(
            itemActedOn,
          );

          const color = UI.getContextSubjectColor(context);

          if (this.canDoAction(actions, action)) {
            items.push({
              label: `${
                action.name
              } <span style='color:${color}'>${name}</span>`,
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
    case 'player:take':
      getItems.forEach((item) => {
        const {
          actions, name, x, y, id, uuid, timestamp,
        } = Object.assign(
          item,
          Query.getItemData(item.id),
        );

        const color = UI.getContextSubjectColor(item.context);

        if (this.canDoAction(actions, action)) {
          items.push({
            label: `${
              action.name
            } <span style='color:${color}'>${name}</span>`,
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
    case 'item:equip':
      if (this.clickedOn('inventorySlot') && this.isFromInventory()) {
        const {
          actions, context, name, uuid, id,
        } = Query.getItemData(
          itemActedOn,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          items.push({
            label: `${
              action.name
            } <span style='color:${color}'>${name}</span>`,
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
    case 'item:unequip':
      if (this.clickedOn('wearSlot') && this.isFromInventory()) {
        const {
          name, actions, context, id, uuid,
        } = Query.getItemData(
          this.player.wear[this.miscData.slot].id,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          items.push({
            label: `${
              action.name
            } <span style='color:${color}'>${name}</span>`,
            action,
            type: 'item',
            miscData: this.miscData,
            id,
            uuid,
          });
        }
      }
      break;

      // Examine item/object/npc from where possible
    case 'player:examine':
    case 'player:screen:npc:trade:action:value':
      if (this.isFromGameCanvas()) {
        if (
          foregroundData
            && this.canDoAction(foregroundData.actions, action)
        ) {
          const fgColor = UI.getContextSubjectColor(foregroundData.context);
          items.push({
            label: `${action.name} <span style='color:${fgColor}'>${
              foregroundData.name
            }</span>`,
            action,
            examine: foregroundData.examine,
            type: 'foreground',
            id: foregroundData.id,
          });
        }

        getNPCs.forEach(({
          actions, name, context, examine, id,
        }) => {
          if (this.canDoAction(actions, action)) {
            const color = UI.getContextSubjectColor(context);
            items.push({
              label: `${
                action.name
              } <span style='color:${color}'>${name}</span>`,
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
          } = Object.assign(
            item,
            Query.getItemData(item.id),
          );

          const color = UI.getContextSubjectColor(item.context);

          if (this.canDoAction(actions, action)) {
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
        } = Query.getItemData(
          itemActedOn,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          items.push({
            label: `${
              action.name
            } <span style='color:${color}'>${name}</span>`,
            action,
            examine,
            type: 'item',
            id,
          });
        }
      }
      break;

      // Mine rocks
    case 'player:resource:mining:rock':
      if (foregroundData && this.canDoAction(foregroundData, action)) {
        const color = UI.getContextSubjectColor(foregroundData.context);
        items.push({
          label: `${action.name} <span style='color:${color}'>${
            foregroundData.name
          }</span>`,
          action,
          type: 'mine',
          coordinates: this.coordinates.map,
          at: {
            x: this.coordinates.viewport.x,
            y: this.coordinates.viewport.y,
          },
          id: foregroundData.id,
        });
      }

      break;

    case 'player:resource:smelt:furnace:action':
    case 'player:resource:smelt:anvil:action':
      if (this.clickedOn('furnaceSlot') || this.clickedOn('anvilSlot')) {
        const {
          actions, context, name, uuid, id,
        } = Query.getItemData(
          itemActedOn,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          items.push({
            label: `${
              action.name
            } <span style='color:${color}'>${name}</span>`,
            action,
            type: 'item',
            miscData: this.miscData,
            uuid,
            id,
          });
        }
      }
      break;

      // Push
    case 'player:resource:goldenplaque:push':
    case 'player:resource:smelt:furnace:pane':
    case 'player:resource:smith:anvil:pane':
      if (foregroundData && this.canDoAction(foregroundData, action)) {
        const color = UI.getContextSubjectColor(foregroundData.context);
        items.push({
          label: `${action.name} <span style='color:${color}'>${
            foregroundData.name
          }</span>`,
          action,
          type: 'object',
          at: {
            x: this.coordinates.viewport.x,
            y: this.coordinates.viewport.y,
          },
          id: foregroundData.id,
          tile: this.tile,
        });
      }

      break;

      // Bank and Trading
    case 'player:screen:bank':
    case 'player:screen:npc:trade':
      if (this.isFromGameCanvas()) {
        if (
          foregroundData
            && this.canDoAction(foregroundData.actions, action)
        ) {
          const fgColor = UI.getContextSubjectColor(foregroundData.context);
          items.push({
            label: `${action.name} <span style='color:${fgColor}'>${
              foregroundData.name
            }</span>`,
            action,
            examine: foregroundData.examine,
            type: 'foreground',
            id: foregroundData.id,
          });
        }

        getNPCs.forEach(({
          actions, name, context, examine, id,
        }) => {
          if (this.canDoAction(actions, action)) {
            const color = UI.getContextSubjectColor(context);
            items.push({
              label: `${
                action.name
              } <span style='color:${color}'>${name}</span>`,
              action,
              examine,
              type: 'npc',
              id,
            });
          }
        });
      }

      break;

    case 'player:screen:bank:action':
      if (this.clickedOn('bankSlot') || this.clickedOn('inventorySlot')) {
        const {
          name, examine, id, context, actions,
        } = Query.getItemData(
          itemActedOn,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          const quantity = [1, 5, 10, 'All'];

          quantity.forEach((q) => {
            items.push({
              label: `${
                action.name
              }-${q.toString()} <span style='color:${color}'>${name}</span>`,
              params: {
                quantity: q,
              },
              action,
              examine,
              type: 'item',
              id,
            });
          });
        }
      }
      break;

    case 'player:screen:npc:trade:action':
      if (this.clickedOn('shopSlot') || this.clickedOn('inventorySlot')) {
        const {
          name, examine, id, context, actions,
        } = Query.getItemData(
          itemActedOn,
        );

        const color = UI.getContextSubjectColor(context);

        if (this.canDoAction(actions, action)) {
          const quantity = [1, 5, 10, 50];

          quantity.forEach((q) => {
            items.push({
              label: `${
                action.name
              }-${q.toString()} <span style='color:${color}'>${name}</span>`,
              params: {
                quantity: q,
              },
              action,
              examine,
              type: 'item',
              id,
            });
          });
        }
      }
      break;
    }
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
    // TODO
    // Get the top-left X,Y and right-bottom X,Y of .gameMap and then
    // see if mouse-click is within those limits. Technically, you
    // would have clicked on the gameCanvas because of X,Y origin.
    return this.clickedOn('gameMap') || this.clickedOn('bankSlot');
  }

  /**
   * Get the shop inventory based on NPC
   *
   * @returns {array}
   */
  getShopInventory() {
    if (!this.player.objectId) return [];
    const shopIndex = world.shops.findIndex(
      q => q.npcId === this.player.objectId,
    );

    return world.shops[shopIndex].inventory;
  }

  /**
   * Checks to see if an action can be acted upon with the item or subject
   *
   * @example 'Does a pickaxe include an action of "Mine"?'
   * @param {object} item The item being checked
   * @param {object} action The action being checked
   * @returns {boolean}
   */
  canDoAction(item, action) {
    const name = action.name.toLowerCase();

    // Can we allow this action while a certain pane is open?
    // (ie: Equip not allowed while accessing bank)
    if (action.disallowWhile && action.disallowWhile.includes(this.currentPane)) return false;
    if (action.onPane && !action.onPane.includes(this.currentPane)) return false;

    // If we have a list of actions
    if (item instanceof Array) {
      return item.includes(name);
    }

    // If we have just one resource that has actions
    if (item && item.actions) {
      return item.actions.includes(name);
    }

    return false;
  }
}

export default ContextMenu;

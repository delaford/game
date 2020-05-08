/**
 * Actions from context-menu.
 * for example: (take, drop, pickup, etc.)
 */

import { Bank, Shop } from '@server/core/functions';
import { general, wearableItems } from '@server/core/data/items';

import Action from '@server/player/action';
import ContextMenu from '@server/core/context-menu';
import Handler from '@server/player/handler';
import Item from '@server/core/item';
import Map from '@server/core/map';
import Mining from '@server/core/skills/mining';
import Woodcutting from '@server/core/skills/woodcutting';
import Query from '@server/core/data/query';
import Socket from '@server/socket';
import UI from 'shared/ui';
import pipe from '@server/player/pipeline';
import uuid from 'uuid/v4';
import world from '@server/core/world';

export default {
  'player:walk-here': (data) => {
    if (data.tileWalkable) {
      Handler['player:mouseTo']({
        data: {
          id: data.player.uuid,
          coordinates: { x: data.clickedTile.x, y: data.clickedTile.y },
        },
        player: {
          socket_id: data.player.uuid,
        },
      });
    }
  },
  /**
   * A player moves to a new tile via mouse
   */
  'player:mouseTo': async (data) => {
    const movingData = Object.hasOwnProperty.call(data, 'doing') ? data : data.data;
    const { x, y } = movingData.coordinates;

    const playerId = movingData.id || data.player.id;
    const playerIndexMoveTo = world.players.findIndex(p => p.uuid === playerId);
    const matrix = await Map.getMatrix(world.players[playerIndexMoveTo]);

    world.players[playerIndexMoveTo].path.grid = matrix;
    world.players[playerIndexMoveTo].path.current.walkable = true;

    const location = movingData.location || null;

    Map.findPath(movingData.id, x, y, location);
  },
  'player:examine': (data) => {
    Socket.emit('item:examine', {
      data: { type: 'normal', text: data.item.examine },
      player: {
        socket_id: data.player.socket_id,
      },
    });
  },
  'player:inventory-drop': (data) => {
    const itemInventory = data.player.inventory.slots.find(s => s.slot === data.data.miscData.slot);

    const itemUuid = itemInventory.uuid;

    const playerIndex = world.players.findIndex(p => p.uuid === data.id);
    world.players[playerIndex].inventory.slots = world.players[playerIndex].inventory.slots
      .filter(v => v.slot !== data.data.miscData.slot);
    Socket.broadcast('player:movement', world.players[playerIndex]);

    // Add item back to the world
    // from the grasp of the player!
    world.items.push({
      id: data.item.id,
      uuid: itemUuid,
      qty: itemInventory.qty || null,
      x: world.players[playerIndex].x,
      y: world.players[playerIndex].y,
      timestamp: Date.now(),
    });

    console.log(`Dropping: ${data.item.id} (${itemInventory.qty || 0}) at ${world.players[playerIndex].x}, ${world.players[playerIndex].x}`);

    Socket.broadcast('world:itemDropped', world.items);
  },

  /**
   * A player equips an item from their inventory
   */
  'item:equip': async (data) => {
    const playerIndex = world.players.findIndex(p => p.uuid === data.id);
    const getItem = wearableItems.find(i => i.id === data.item.id);
    const alreadyWearing = world.players[playerIndex].wear[getItem.slot];
    if (alreadyWearing) {
      await pipe.player.unequipItem({
        item: {
          uuid: alreadyWearing.uuid,
          id: alreadyWearing.id,
          slot: data.item.miscData.slot,
        },
        replacing: true,
        id: data.id,
      });

      pipe.player.equippedAnItem(data);
    } else {
      pipe.player.equippedAnItem(data);
    }
  },

  /**
   * A player unequips an item from their wear tab
   */
  'item:unequip': (data) => {
    const itemUnequipping = data.player.wear[data.item.miscData.slot];
    const newData = Object.assign(
      data,
      {
        item: {
          id: itemUnequipping.id,
          uuid: itemUnequipping.uuid,
          slot: data.item.miscData.slot,
        },
      },
    );
    pipe.player.unequipItem(newData);
  },

  /**
   * Start building the context menu for the player
   */
  'player:context-menu:build': async (incomingData) => {
    // TODO
    // Pass only socket_id and grep from
    // instead of passing whole player object
    const contextMenu = new ContextMenu(
      incomingData.data.player,
      incomingData.data.tile,
      incomingData.data.miscData,
    );

    const items = await contextMenu.build();

    if (incomingData.data.miscData.firstOnly) {
      Socket.emit('game:context-menu:first-only', {
        data: items,
        player: incomingData.data.player,
      });
    } else {
      Socket.emit('game:context-menu:items', {
        data: items,
        player: incomingData.data.player,
      });
    }
  },
  'player:context-menu:action': (incoming) => {
    const miscData = incoming.data.data.item.miscData || false;
    const action = new Action(incoming.data.player.socket_id, miscData);
    action.do(incoming.data.data, incoming.data.queueItem);
  },

  'player:resource:goldenplaque:push': (data) => {
    const { playerIndex } = data;

    const { id } = UI.randomElementFromArray(wearableItems);

    world.items.push({
      id,
      uuid: uuid(),
      x: 20,
      y: 108,
      timestamp: Date.now(),
    });

    Socket.broadcast('world:itemDropped', world.items);

    Socket.emit('game:send:message', {
      player: { socket_id: world.players[playerIndex].socket_id },
      text: 'You feel a magical aurora as an item starts to appear from the ground...',
    });
  },

  'player:take': (data) => {
    const { playerIndex, todo } = data;
    const { id } = Query.getItemData(todo.item.id);
    const itemToTake = world.items.findIndex(e => (e.x === todo.at.x)
      && (e.y === todo.at.y) && (e.uuid === todo.item.uuid));
    const worldItem = world.items[itemToTake];
    if (worldItem) {
      // If qty not specified, we are picking up 1 item.
      const quantity = worldItem.qty || 1;
      world.items.splice(itemToTake, 1);

      Socket.broadcast('item:change', world.items);

      console.log(`Picking up: ${todo.item.id} (${todo.item.uuid.substr(0, 5)}...)`);

      world.players[playerIndex].inventory.add(id, quantity, todo.item.uuid);

      // Add respawn timer on item (if is a respawn)
      const resetItemIndex = world.respawns.items.findIndex(i => (
        i.respawn && i.x === todo.at.x && i.y === todo.at.y
      ));

      if (resetItemIndex !== -1) {
        world.respawns.items[resetItemIndex].pickedUp = true;
        world.respawns.items[resetItemIndex].willRespawnIn = Item.calculateRespawnTime(
          world.respawns.items[resetItemIndex].respawnIn,
        );
      }

      // Tell client to update their inventory
      Socket.emit('core:refresh:inventory', {
        player: { socket_id: world.players[playerIndex].socket_id },
        data: world.players[playerIndex].inventory.slots,
      });
    }
  },

  /**
   * A player wants opening a trade shop
   */
  'player:screen:npc:trade': (data) => {
    console.log('Accessing trade shop...', data.todo.item.id);
    world.players[data.playerIndex].currentPane = 'shop';
    world.players[data.playerIndex].objectId = data.todo.item.id;

    Socket.emit('open:screen', {
      player: { socket_id: world.players[data.playerIndex].socket_id },
      screen: 'shop',
      payload: world.shops.find(e => e.npcId === data.todo.item.id),
    });
  },

  /**
   * A player wants to buy or sell an item (and sometimes check its value)
   */
  'player:screen:npc:trade:action': (data) => {
    const quantity = data.item.params ? data.item.params.quantity : 0;
    const shop = new Shop(
      data.player.objectId,
      data.id,
      data.item.id,
      data.doing,
      quantity,
    );

    // Simple check for the item's price
    if (data.doing === 'value') {
      shop[data.doing]();
    } else {
      // We will be buying or selling an item
      const response = shop[data.doing]();

      /** UPDATE PLAYER DATA */
      if (Shop.successfulSale(response)) {
        world.shops[shop.shopIndex].inventory = response.shopItems;
        world.players[shop.playerIndex].inventory.slots = response.inventory;

        // Refresh client with new data
        Socket.emit('core:refresh:inventory', {
          player: { socket_id: world.players[shop.playerIndex].socket_id },
          data: response.inventory,
        });

        Socket.emit('open:screen', {
          player: { socket_id: world.players[shop.playerIndex].socket_id },
          screen: 'shop',
          payload: world.shops[shop.shopIndex],
        });
      }
    }
  },

  /**
   * A player wants to access their bank
   */
  'player:screen:bank': (data) => {
    world.players[data.playerIndex].currentPane = 'bank';

    Socket.emit('open:screen', {
      player: { socket_id: world.players[data.playerIndex].socket_id },
      screen: 'bank',
      payload: { items: world.players[data.playerIndex].bank },
    });
  },

  /**
   * A player withdraws or deposits items from their bank or inventory
   */
  'player:screen:bank:action': async (data) => {
    const bank = new Bank(
      data.id,
      data.item.id,
      data.item.params.quantity,
      data.doing,
    );

    try {
      const { inventory, bankItems } = await bank[data.doing]();

      /** UPDATE PLAYER DATA */
      world.players[bank.playerIndex].bank = bankItems;
      world.players[bank.playerIndex].inventory.slots = inventory;


      // Refresh client with new data
      Socket.emit('core:refresh:inventory', {
        player: { socket_id: world.players[bank.playerIndex].socket_id },
        data: inventory,
      });

      Socket.emit('core:bank:refresh', {
        player: { socket_id: world.players[bank.playerIndex].socket_id },
        data: bankItems,
      });
    } catch (err) {
      Socket.emit('game:send:message', {
        player: { socket_id: data.player.socket_id },
        text: err.message,
      });
    }
  },

  /**
   * A player is going to attempt to mine a rock
   */
  'player:resource:mining:rock': async (data) => {
    const mining = new Mining(data.playerIndex, data.todo.item.id);

    try {
      const rockMined = await mining.pickAtRock();
      const resource = general.find(i => i.id === rockMined.resources);

      // Tell user of successful resource gathering
      Socket.sendMessageToPlayer(data.playerIndex, `You successfully mined some ${resource.name}.`);

      // Extract resource and either add to inventory or drop it
      mining.extractResource(resource);

      // Update rock to dead-rock after successful mine
      world.map.foreground[data.todo.actionToQueue.onTile] = 532;

      // Update the experience
      mining.updateExperience(rockMined.experience);

      // Tell client of their new experience in that skill
      Socket.emit('resource:skills:update', {
        player: { socket_id: world.players[data.playerIndex].socket_id },
        data: world.players[data.playerIndex].skills,
      });

      // Update client of dead rock
      Socket.broadcast('world:foreground:update', world.map.foreground);

      // Add this resource to respawn clock
      world.respawns.resources.push({
        setToTile: rockMined.id + 253,
        onTile: data.todo.actionToQueue.onTile,
        willRespawnIn: Item.calculateRespawnTime(rockMined.respawnIn),
      });
    } catch (err) {
      // Tell player of their error
      // either no pickaxe or no rock available
      Socket.sendMessageToPlayer(data.playerIndex, err.message);
    }
  },

  'player:resource:chopping:tree': async (data) => {
    const woodcutting = new Woodcutting(data.playerIndex, data.todo.item.id);

    try {
      const treeChopped = await woodcutting.swingAtTree();
      const resource = general.find(i => i.id === treeChopped.resources);

      Socket.sendMessageToPlayer(data.playerIndex, `You successfully chopped some ${resource.name}.`);

      woodcutting.extractResource(resource);

      world.map.foreground[data.todo.actionToQueue.onTile] = 532;

      woodcutting.updateExperience(treeChopped.experience);

      Socket.emit('resource:skills:update', {
        player: { socket_id: world.players[data.playerIndex].socket_id },
        data: world.players[data.playerIndex].skills,
      });

      // TODO make sure this is cut down tree is in the correct x,y position on map.
      // Also figure out how to make a tree stump appear properly.
      Socket.broadcast('world:foreground:update', world.map.foreground);
      console.log(treeChopped.id + 253);
      world.respawns.resources.push({
        setToTile: treeChopped.id + 254,
        onTile: data.todo.actionToQueue.onTile,
        willRespawnIn: Item.calculateRespawnTime(treeChopped.respawnIn),
      });
    } catch (err) {
      Socket.sendMessageToPlayer(data.playerIndex, err.message);
    }
  },
};

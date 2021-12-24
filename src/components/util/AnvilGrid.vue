<template>
  <!-- eslint-disable max-len -->
  <div class="main grid_container">
    <div
      v-for="(item, i) in items"
      :key="i">
      <div style="width: 75px">
        <div
          v-if="slotHasItem(i)"
          :style="{
            backgroundImage: 'url(' + getBgUrl(i) + ')',
            // eslint-disable-next-line
          backgroundPosition: `left -${(getItem(i).column * 32)}px top -${(getItem(i).row * 32)}px`
          }"
          :class="`slot ${getItemFromSlot(i).isLocked} ${getItemFromSlot(i).id} ${gridData(screen).classId} ${isItemSelected(i)}`"
          @click.left="selectItem($event)"
          @mouseover="showContextMenu($event, i, true)"
          @click.right="showContextMenu($event, i)"
        />
        <div class="name">{{ displayName(getItem(i).name) }}</div>
        <div
          :class="{ canSmith: items[i].hasBars && items[i].hasLevel, notEnoughBars: !items[i].hasBars, levelNeeded: !items[i].hasLevel }"
          class="barsNeeded"
        >{{ items[i].barsNeeded }} bar{{ items[i].barsNeeded === 1 ? '' : 's' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */
import UI from 'shared/ui';
import bus from '../../core/utilities/bus';
import ClientUI from '../../core/utilities/client-ui';
// import { weapons } from '../../../server/core/data/respawn';

export default {
  props: {
    slots: {
      type: Number,
      required: true,
    },
    images: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      action: '',
    };
  },
  created() {
    this.$forceUpdate();
    bus.$on('game:context-menu:first-only', ClientUI.displayFirstAction);
  },
  methods: {
    displayName(name) {
      return name
        .split(' ')
        .slice(1)
        .join(' ');
    },
    /**
     * Get the item's column of a certain slot in the inventory
     *
     * @param {integer} slotNumber The slot index in the inventory
     * @return {integer|boolean}
     */
    getItem(slotNumber) {
      const getItem = this.getItemFromSlot(slotNumber);

      const getGraphic = UI.getItemData(getItem.id);

      if (getItem) {
        let { column } = getGraphic.graphics;
        if (getGraphic.graphics.quantityLevel) {
          const qtyColumn = this.getQuantityColumn(
            slotNumber,
            getGraphic.graphics,
          );
          column = qtyColumn;
        }

        return {
          name: getGraphic.name,
          column,
          row: getGraphic.graphics.row,
        };
      }

      return false;
    },

    /**
     * Get the correct graphic depending on quantity on item
     *
     * @param {integer} slotNumber The slot index in the inventory
     * @return {integer}
     */
    getQuantityColumn(slotNumber, graphics) {
      const findCorrectItem = this.items.find(e => e.slot === slotNumber);

      if (findCorrectItem.qty && graphics.quantityLevel) {
        findCorrectItem.graphics = graphics;
        findCorrectItem.column = graphics.quantityLevel.findIndex(
          x => x > findCorrectItem.qty,
        );
        findCorrectItem.column = (findCorrectItem.column === -1
          ? graphics.quantityLevel.length
          : findCorrectItem.column) - 1;
      }

      return findCorrectItem.column;
    },
    /**
     * Does this item quantity, and thus is stackable?
     *
     * @param {integer} item The item of the shouldComponentUpdate = (nextProps, nextState) => {
     * @return {boolean}
     */
    hasQuantity(item) {
      if (this.screen === 'shop' && this.getItemFromSlot(item).qty !== 1) return true;
      if (this.getItemFromSlot(item).graphics) {
        return this.getItemFromSlot(item).graphics.quantityLevel;
      }

      return (
        this.getItemFromSlot(item).qty && this.getItemFromSlot(item).qty > 1
      );
    },
    /**
     * Is the item selected?
     *
     * @param {integer} slot The slot we are examining
     * @return {boolean}
     */
    isItemSelected(slot) {
      return this.itemSelected === slot ? 'selected' : '';
    },
    /**
     * Select the item to let player know its in use
     *
     * @param {integer} slot The item in the slot we are selecting
     */
    selectItem(event) {
      // Allow 'selecting' an item only on the Inventory or if its not already selected

      bus.$emit('canvas:select-action', {
        event,
        item: this.$store.getters.action.object,
      });

      console.log(this.$store.getters.action.object);

      // TODO
      // Make 'context-menu' to smelt bars into weapons
      // Do actual smithing from weapons from item click on menu
      // Do same thing for bar of ore. Lower bar takes prescedent
      // Earn exp and save

      // this.itemSelected = this.itemSelected === slot || this.screen !== 'inventory' ? false : slot;
    },
    gridData(section) {
      const modifier = {
        furnace: {
          columns: 6,
          rows: 1,
          classId: 'furnaceSlot',
        },
        anvil: {
          columns: 5,
          rows: 3,
          classId: 'anvilSlot',
        },
        inventory: {
          columns: 4,
          rows: 6,
          classId: 'inventorySlot',
        },
        bank: {
          columns: 11,
          rows: 6,
          classId: 'bankSlot',
        },
        shop: {
          columns: 11,
          rows: 4,
          classId: 'shopSlot',
        },
      };

      return modifier[section];
    },
    /**
     * Right-click brings up context-menu
     *
     * @param {event} event The mouse-click event
     */
    showContextMenu(event, index, firstOnly = false) {
      this.$forceUpdate();

      const coordinates = UI.getViewportCoordinates(event);

      const data = {
        event,
        coordinates,
        slot: index,
        target: event.target,
      };

      if (!firstOnly) {
        event.preventDefault();

        bus.$emit('PLAYER:MENU', data);
      }

      if (firstOnly && event && event.target) {
        bus.$emit('PLAYER:MENU', {
          coordinates,
          event,
          slot: index,
          target: event.target,
          firstOnly: true,
        });
      }
    },
    /**
     * Check to see if this slot is available
     *
     * @param {integer} slotNumber The index of the slot in inventory
     * @return {boolean}
     */
    slotHasItem(slotNumber) {
      const itemFound = this.items.find(s => s.slot === slotNumber);
      if (!itemFound) {
        return false;
      }

      if (itemFound) {
        return true;
      }

      return false;
    },
    /**
     * Gets the item from current slot
     *
     * @param {integer} slotNumber The current slot number
     * @returns {object}
     */
    getItemFromSlot(slotNumber) {
      return this.items.find(s => s.slot === slotNumber);
    },
    /**
     * Get the correct background URL to show in inventory
     *
     * @param {string} item The item type in slot
     * @returns {string}
     */
    getBgUrl(slotNumber) {
      const getItem = UI.getItemData(this.getItemFromSlot(slotNumber).id);

      if (!this.images) {
        return false;
      }

      switch (getItem.graphics.tileset) {
      case 'general':
        return this.images.generalImage.src;
      case 'jewelry':
        return this.images.jewelryImage.src;
      case 'armor':
        return this.images.armorImage.src;
      default:
      case 'weapons':
        return this.images.weaponsImage.src;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$color: #706559;
$background_color: #ededed;
$default_color: #383838;

div.grid_container {
  display: flex;
  justify-content: space-between;
  overflow-y: auto;
  box-sizing: border-box;
  font-family: "GameFont", serif;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darken($background_color, 35%);
  }

  .locked-item {
    filter: contrast(0.35);
  }

  div.slot {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin: 0 1em;
    text-align: center;
    background-color: transparent;

    .qty {
      font-size: 10px;
      color: yellow;
      text-shadow: 1px 1px 0 black;
      float: left;
    }
  }

  .name {
    font-size: 0.45em;
    margin: 0.5em 0;
  }

  .barsNeeded {
    font-size: 0.5em;
    margin-top: 0.75em;
  }

  .levelNeeded {
    color: #901313 !important;
  }

  .notEnoughBars {
    color: #ffb42a;
  }

  .canSmith {
    color: #14ff14;
  }
}
</style>

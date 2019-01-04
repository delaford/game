<template>
  <div
    class="inventory_slot">
    <!-- eslint-disable max-len -->
    <div
      v-for="(n, i) in (0, 23)"
      v-if="slotHasItem(i)"
      :key="i"
      :style="{
        backgroundImage: 'url(' + getBgUrl(i) + ')',
        backgroundPosition: `left -${(getItem(i).column * 32)}px top -${(getItem(i).row * 32)}px`
      }"
      class="slot inventorySlot"
      @click.right="rightClick($event, i)"
    />
    <div
      v-else
      class="slot inventorySlot">
      <!-- Empty slot -->
    </div>
  </div>
</template>

<script>
import UI from 'shared/ui';
import bus from '../../core/utilities/bus';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    images() {
      return this.game.map.images;
    },
    items() {
      return this.game.player.inventory;
    },
  },
  methods: {
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
     * Get the item's column of a certain slot in the inventory
     *
     * @param {integer} slotNumber The slot index in the inventory
     * @return {integer|boolean}
     */
    getItem(slotNumber) {
      const getItem = this.getItemFromSlot(slotNumber);

      if (getItem) {
        return {
          column: getItem.graphics.column,
          row: getItem.graphics.row,
        };
      }

      return false;
    },

    /**
     * Right-click brings up context-menu
     *
     * @param {event} event The mouse-click event
     */
    rightClick(event, index) {
      const coordinates = UI.getViewportCoordinates(event);

      const data = {
        event,
        coordinates,
        slot: index,
        target: event.target,
      };

      event.preventDefault();

      bus.$emit('PLAYER:MENU', data);
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
      const getItem = this.getItemFromSlot(slotNumber);

      if (!this.images) {
        return false;
      }

      switch (getItem.graphics.tileset) {
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
div.inventory_slot {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(4, 35px);
  grid-template-rows: repeat(6, 35px);
  grid-gap: 5px;

  div.slot {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin: 1px 0 0 1px;
    text-align: center;
    background-color: transparent;
  }
}
</style>

<template>
  <div class="inventory_slot" v-if="library">
    <!-- eslint-disable max-len -->
    <div
      v-for="(n, i) in (0, 23)"
      :key="i"
      v-if="slotHasItem(i)"
      @click.right="rightClick($event, i)"
      class="slot inventorySlot"
      v-bind:style="{
        backgroundImage: 'url(data:image/png;base64,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)',
        backgroundPosition: `right ${(getItem(i) * 32) + 32}px top 0`
      }"
      >
    </div>
    <div v-else class="slot inventorySlot">
      <!-- Empty slot -->
    </div>
  </div>
</template>

<script>
// https://github.com/KABBOUCHI/vue-tippy
import bus from '../../core/utilities/bus';
import UI from '../../core/utilities/ui';
import Socket from '../../core/utilities/socket';

export default {
  props: ['game'],
  data() {
    return {
      library: false,
    };
  },
  created() {
    this.loadItemData();
    bus.$on('client:game:receive:items', data => this.constructItemLibrary(data));
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
      const getItemID = this.items.find(s => s.slot === slotNumber).itemID;
      const getItemDetails = this.library.find(i => i.itemID === getItemID);

      if (getItemDetails) {
        return getItemDetails.graphics.column;
      }

      return false;
    },
    /**
     * Load the items from the server
     */
    constructItemLibrary(data) {
      this.library = data;
    },
    /**
     * Fetch the items from the server
     */
    loadItemData() {
      Socket.emit('game:fetch:items');
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
     * Get the correct background URL to show in inventory
     *
     * @param {string} item The item type in slot
     * @returns {string}
     */
    getBgUrl(item) {
      switch (item.graphics.tileset) {
        default:
        case 'weapons':
          return this.images.weaponsImage.src;
      }
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

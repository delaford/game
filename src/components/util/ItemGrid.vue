<template>
  <div
    :style="slotColumnRows"
    class="main inventory_slot">
    <div
      v-for="(n, i) in (0, slots)"
      :key="i"
    >
      <div
        v-if="slotHasItem(i)"
        :style="{
          backgroundImage: 'url(' + getBgUrl(i) + ')',
          // eslint-disable-next-line
          backgroundPosition: `left -${(getItem(i).column * 32)}px top -${(getItem(i).row * 32)}px`
        }"
        class="slot inventorySlot"
        @click.right="rightClick($event, i)" />
      <div
        v-else
        class="slot inventorySlot">
        <!-- Empty slot -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */
import UI from 'shared/ui';
import bus from '../../core/utilities/bus';

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
      //
    };
  },
  computed: {
    slotColumnRows() {
      return {
        'grid-template-columns': '35px '.repeat(this.columnsAndRows(this.screen).columns),
        'grid-template-rows': '35px '.repeat(this.columnsAndRows(this.screen).rows),
      };
    },
  },
  created() {
    this.$forceUpdate();
  },
  methods: {
    columnsAndRows(section) {
      const modifier = {
        inventory: {
          columns: 4,
          rows: 6,
        },
        bank: {
          columns: 11,
          rows: 6,
        },
      };

      return modifier[section];
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

      console.log(data);


      bus.$emit('PLAYER:MENU', data);
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
     * Get the item's column of a certain slot in the inventory
     *
     * @param {integer} slotNumber The slot index in the inventory
     * @return {integer|boolean}
     */
    getItem(slotNumber) {
      const getItem = this.getItemFromSlot(slotNumber);

      const getGraphic = UI.getItemData(getItem.id);

      if (getItem) {
        return {
          column: getGraphic.graphics.column,
          row: getGraphic.graphics.row,
        };
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

div.inventory_slot {
  display: grid;
  height: 275px;
  overflow-y: scroll;
  box-sizing: border-box;
  grid-template-rows: repeat(6, 35px);
  grid-gap: 5px;
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

  div.slot {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin: 1px 0 0 1px;
    text-align: center;
    background-color: transparent;

    &.selected {
      filter: drop-shadow(1px 0 0 yellow) drop-shadow(-1px 0 0 yellow) drop-shadow(0 1px 0 yellow) drop-shadow(0 -1px 0 yellow);
    }
  }
}
</style>

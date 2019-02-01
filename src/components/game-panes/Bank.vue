<template>
  <div class="bankView">
    <pane-header text="Bank of Delaford" />
    <div
      class="main inventory_slot">
      <div
        v-for="(n, i) in (0, 250)"
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
  </div>
</template>

<script>
import UI from 'shared/ui';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      gameData: this.data.items,
    };
  },
  computed: {
    images() {
      return this.game.map.images;
    },
    items() {
      return this.gameData;
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

.bankView {
  background-color: $color;
  font-family: "GameFont", serif;
  border: 5px solid darken($color, 10%);

  .header {
    background: lighten($color, 10%);
    height: 30px;

    .close {
      float: right;
      width: 30px;
      box-sizing: border-box;
      height: 30px;
      background-color: darken(red, 10%);
      color: white;
      font-size: 1em;
      padding: 5px 2px 5px 5px;
    }
  }

  .main {
    padding: .5em;
  }
}

div.inventory_slot {
  display: grid;
  height: 275px;
  overflow-y: scroll;
  box-sizing: border-box;
  grid-template-columns: repeat(11, 35px);
  grid-template-rows: repeat(6, 35px);
  grid-gap: 5px;

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darken($background_color, 35%);
  }

  overflow-x: hidden;

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

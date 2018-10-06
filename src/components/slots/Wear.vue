<template>
  <div class="wear">
    <svg>
      <line
        x1="77"
        x2="77"
        y1="25"
        y2="190"/>
      <line
        x1="25"
        x2="25"
        y1="130"
        y2="190"/>
      <line
        x1="130"
        x2="130"
        y1="130"
        y2="190"/>
      <line
        x1="137"
        x2="27"
        y1="145"
        y2="145"/>
      <line
        x1="132"
        x2="27"
        y1="93"
        y2="93"/>
    </svg>

    <div class="wrapper">
      <div class="first_row row">
        <div class="slot head"/>
      </div>

      <div class="second_row row">
        <div class="slot cape"/>
        <div class="slot necklace"/>
        <div class="slot arrows"/>
      </div>

      <div class="third_row row">
        <div
          v-tippy
          v-if="slotFilled('right_hand')"
          :class="showBackground('right_hand')"
          :style="{
            backgroundPosition: `left -${(tileOffset('right_hand') * 32)}px top`
          }"
          :title="getTooltip('right_hand')"
          class="slot sword"
          @click.right="rightClick($event, 'right_hand')"/>
        <div
          v-else
          class="slot sword right_hand"/>
        <div
          v-tippy
          v-if="slotFilled('armor')"
          :class="showBackground('armor')"
          :style="{
            backgroundPosition: `left -${(tileOffset('armor') * 32)}px top`
          }"
          :title="getTooltip('armor')"
          class="slot torso"
          @click.right="rightClick($event, 'armor')"/>
        <div
          v-else
          class="slot torso armor"/>
        <div class="slot shield"/>
      </div>

      <div class="fourth_row row">
        <div class="slot gloves"/>
        <div class="slot boots"/>
        <div class="slot ring"/>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';
import UI from '../../core/utilities/ui';
import Socket from '../../core/utilities/socket';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      library: false,
    };
  },
  computed: {
    wear() {
      return this.game.player.wear;
    },
  },
  created() {
    this.loadItemData();

    bus.$on('client:game:receive:items', data => this.constructItemLibrary(data));
  },
  methods: {
    /**
     * Check to see if slot is filled with an item
     *
     * @param {string} slot The slot to check
     * @returns {boolean}
     */
    slotFilled(slot) {
      return this.wear[slot] !== null;
    },
    /**
     * Show tooltip when hovering over equipped slot
     *
     * @param {string} slot The slot being shown
     * @returns {string}
     */
    getTooltip(slot) {
      const wearItem = this.wear[slot];
      if (Object.hasOwnProperty.call(wearItem, 'id') && this.library) {
        return `${this.getItem(wearItem.id).name}
            <br>${this.getItem(wearItem.id).stats.attack} att &middot;
            ${this.getItem(wearItem.id).stats.defense} def`;
      }

      return false;
    },
    /**
     * Load the items from the server
     */
    constructItemLibrary(data) {
      // TODO
      // Abstract this to global method
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
    rightClick(event, slot) {
      const coordinates = UI.getViewportCoordinates(event);

      const data = {
        event,
        coordinates,
        slot,
        target: event.target,
      };

      event.preventDefault();

      bus.$emit('PLAYER:MENU', data);
    },
    /**
     * Get correct tile on slots
     *
     * @param {string} slot The slot tile being checked on
     * @returns {boolean}
     */
    tileOffset(slot) {
      switch (slot) {
        case 'armor':
          return this.wear.armor ? this.wear.armor.graphics.column : 0;
        default:
        case 'right_hand':
          return this.wear.right_hand ? this.wear.right_hand.graphics.column : 0;
      }
    },
    getItem(id) {
      if (!this.library) return false;
      return this.library.find(i => i.id === id);
    },
    /**
     * Shows the correct background type in slot
     *
     * @param {string} classImg The image being scrutinized
     * @returns {string}
     */
    showBackground(classImg) {
      switch (classImg) {
        case 'armor':
          return this.slotFilled(this.wear.armor) ? 'armorEquipped' : classImg;
        default:
        case 'right_hand':
          return this.slotFilled(this.wear.right_hand) ? 'swordEquipped' : classImg;
      }
    },
  },
};
</script>

<style lang="scss">
.tippy-content {
  text-align-last: left;
  font-family: "GameFont", sans-serif;
  text-shadow: 1px 1px 0px black;
}
.tippy-tooltip.translucent-theme {
  border-radius: 0px;
}
</style>

<style lang="scss" scoped>
div.wear {
  margin: 0;
  padding: 0;
  height: 100%;
  position: relative;

  svg {
    position: absolute;
    z-index: 5;
    stroke: darken(darkgrey, 25%);
    stroke-width: 3;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  div.wrapper {
    flex-direction: column;
    align-content: center;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(20, [col-start] 1fr);

    div.slot {
      height: 35px;
      z-index: 10;
      box-sizing: border-box;
      width: 35px;
      margin: 0;
      background-color: darken(darkgrey, 10%);
      background-repeat: no-repeat;
      background-position: center;
    }

    div.row {
      width: 100%;
      display: inline-flex;
      margin-bottom: 1em;

      $slots: torso gloves shield head arrows necklace right_hand ring boots cape;
      @each $slot in $slots {
        div.#{$slot} {
          background-image: url(./../../assets/graphics/ui/client/slots/wear/#{$slot}.png);
        }

        div.swordEquipped {
          background-image: url(./../../assets/graphics/items/weapons.png);
        }

        div.armorEquipped {
          background-image: url(./../../assets/graphics/items/armor.png);
        }
      }

    }

    div.first_row {
      grid-column: 1 / span 20;
      justify-content: center;
    }

    div.second_row {
      grid-column: 3 / span 16;
      justify-content: space-around;
    }

    div.third_row {
      grid-column: 1 / span 20;
      justify-content: space-around;
    }

    div.fourth_row {
      grid-column: 1 / span 20;
      margin-bottom: 0;
      justify-content: space-around;
    }
  }
}
</style>

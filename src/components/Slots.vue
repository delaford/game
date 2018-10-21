<template>
  <div class="slots">
    <div class="top_slots">
      <div
        v-for="(slot, i) in slots"
        v-if="i < 3"
        :key="i"
        :class="{active: selected === i}"
        class="slot inventorySlot"
        @click="setPane($event, i)">
        <img
          :src="svg[slot.toLowerCase()]"
          :alt="slot">
      </div>
    </div>

    <div
      v-if="game.player"
      class="pane">
      <Stats
        v-show="selected === 0"
        :game="game" />
      <Inventory
        v-show="selected === 1"
        :game="game" />
      <Wear
        v-show="selected === 2"
        :game="game" />
      <Friend-List
        v-show="selected === 3"
        :game="game" />
      <Settings v-show="selected === 4" />
      <Logout
        v-show="selected === 5"
        :game="game" />
      <Quests
        v-show="selected === 6"
        :game="game" />
    </div>

    <div class="bottom_slots">
      <div
        v-for="(slot, i) in slots"
        v-if="i > 2"
        :key="i"
        :class="{active: selected === i}"
        class="slot"
        @click="setPane($event, i)">
        <img
          :src="svg[slot.toLowerCase()]"
          :alt="slot">
      </div>
    </div>
  </div>
</template>

<script>
import stats from '@/assets/graphics/ui/client/slots/stats.svg';
import inventory from '@/assets/graphics/ui/client/slots/inventory.svg';
import wear from '@/assets/graphics/ui/client/slots/wear.svg';
import friendlist from '@/assets/graphics/ui/client/slots/friendlist.svg';
import settings from '@/assets/graphics/ui/client/slots/settings.svg';
import logout from '@/assets/graphics/ui/client/slots/logout.svg';
import quests from '@/assets/graphics/ui/client/slots/quests.svg';

import Inventory from './slots/Inventory.vue';
import Stats from './slots/Stats.vue';
import FriendList from './slots/FriendList.vue';
import Logout from './slots/Logout.vue';
import Quests from './slots/Quests.vue';
import Settings from './slots/Settings.vue';
import Wear from './slots/Wear.vue';

export default {
  components: {
    Inventory, Stats, FriendList, Logout, Quests, Settings, Wear,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      slots: [
        'Stats',
        'Inventory',
        'Wear',
        'FriendList',
        'Settings',
        'Logout',
        'Quests',
      ],
      selected: 1,
      svg: {
        stats,
        inventory,
        wear,
        friendlist,
        settings,
        logout,
        quests,
      },
    };
  },
  methods: {
    /**
     * Switch to the correct pane upon mouse-click
     *
     * @param {index} index The pane to switch to
     */
    setPane(event, index) {
      this.selected = index;
    },
    /**
     * Get the correct SVG icon to show as the pane header
     *
     * @param {string} icon The pane icon name
     * @returns {string}
     */
    svgPath(icon) {
      return `./src/assets/graphics/ui/client/slots/${icon}.svg`;
    },
  },
};
</script>

<style lang="scss" scoped>
$main_bg_color: grey;

div.slots {
  margin: 0 0 0 5px;
  background: white;

  div.top_slots {
    display: grid;
    grid-template-columns: 25% 50% 25%;
  }

  div.bottom_slots {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    background: #ababab;

    div:last-child {
      border-bottom-right-radius: 3px;
    }
  }

  div.top_slots,
  div.bottom_slots {
    div.active {
      background-color: $main_bg_color;
    }
  }

  div.slot {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: darken($main_bg_color, 10%);
    height: 35px;
    z-index: 10;

    svg {
      z-index: 5;
      fill: darken($main_bg_color, 35%);
    }

    &:hover {
      background-color: lighten($main_bg_color, 5%);
    }
  }

  div.pane {
    background: $main_bg_color;
    height: 235px;
    width: 155px;
    padding: 5px;
  }
}
</style>

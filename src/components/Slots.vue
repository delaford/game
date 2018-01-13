<template>
  <div class="slots">
    <div class="top_slots">
      <div
        v-for="(slot, i) in slots"
        class="slot"
        v-if="i < 3"
        :class="{active: selected === i}"
        @click="setPane($event, i)">
          <img :src="svg[slot.toLowerCase()]" :alt="slot">
      </div>
    </div>

    <div class="pane" v-if="game.player">
      <Stats :game="game" v-show="selected === 0" />
      <Inventory :game="game" v-show="selected === 1" />
      <Friend-List :game="game" v-show="selected === 3" />
      <Settings v-show="selected === 4" />
      <Logout :game="game" v-show="selected === 5" />
      <Quests :game="game" v-show="selected === 6" />
    </div>

    <div class="bottom_slots">
      <div
        v-for="(slot, i) in slots"
        class="slot"
        v-if="i > 2"
        :class="{active: selected === i}"
        @click="setPane($event, i)">
          <img :src="svg[slot.toLowerCase()]" :alt="slot">
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

import Inventory from './slots/Inventory';
import Stats from './slots/Stats';
import FriendList from './slots/FriendList';
import Logout from './slots/Logout';
import Quests from './slots/Quests';
import Settings from './slots/Settings';

export default {
  components: {
    Inventory, Stats, FriendList, Logout, Quests, Settings,
  },
  methods: {
    setPane(event, index) {
      this.selected = index;
    },
    svgPath(icon) {
      return `./src/assets/graphics/ui/client/slots/${icon}.svg`;
    },
  },
  props: ['game'],
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
      selected: 3,
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
};
</script>

<style lang="scss" scoped>
$main_bg_color: grey;

div.slots {
  margin: 0px 0 0px 5px;
  background: white;

  div.top_slots {
    display: grid;
    grid-template-columns: 25% 50% 25%;
  }

  div.bottom_slots {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
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

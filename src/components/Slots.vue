<template>
  <div class="slots">
    <div class="top_slots">
      <div :class="{active: this.slot === 1}" class="slot stats">
        <img :src="svg.stats" alt="Stats">
      </div>
      <div :class="{active: this.slot === 2}" @click="setPane($event, 2)" class="inventory slot">
        <img :src="svg.inventory" alt="Inventory">
      </div>
      <div :class="{active: this.slot === 3}" class="wear slot">
        <img :src="svg.wear" alt="Wear">
      </div>
    </div>

    <div class="pane">
      <Inventory v-if="slot === 2" />
    </div>

    <div class="bottom_slots">
      <div class="slot friends_list" @click="setPane($event, 4)">
        <img :src="svg.friendsList" alt="Friends List">
      </div>
      <div class="slot settings" @click="setPane($event, 5)">
        <img :src="svg.settings" alt="Settings">
      </div>
      <div class="slot logout" @click="setPane($event, 6)">
        <img :src="svg.logout" alt="Logout">
      </div>
      <div class="slot quests" @click="setPane($event, 7)">
        <img :src="svg.quests" alt="Quests">
      </div>
    </div>
  </div>
</template>

<script>
import stats from '@/assets/graphics/ui/client/slots/stats.svg';
import inventory from '@/assets/graphics/ui/client/slots/inventory.svg';
import wear from '@/assets/graphics/ui/client/slots/wear.svg';
import friendsList from '@/assets/graphics/ui/client/slots/friends_list.svg';
import settings from '@/assets/graphics/ui/client/slots/settings.svg';
import logout from '@/assets/graphics/ui/client/slots/logout.svg';
import quests from '@/assets/graphics/ui/client/slots/quests.svg';

import Inventory from './slots/Inventory';

export default {
  components: {
    Inventory,
  },
  methods: {
    setPane(event, index) {
      this.slot = index;
    },
    svgPath(icon) {
      return `./src/assets/graphics/ui/client/slots/${icon}.svg`;
    },
  },
  props: ['game'],
  data() {
    return {
      slot: 2,
      svg: {
        stats,
        inventory,
        wear,
        friendsList,
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

    div.active {
      background-color: $main_bg_color;
    }
  }

  div.bottom_slots {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
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

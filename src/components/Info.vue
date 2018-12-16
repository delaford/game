<template>
  <div
    v-if="player"
    class="info">
    <span v-text="player.username"/>

    <div
      v-if="hp"
      class="health">
      <div
        :style="displayHealthPercentage"
        class="bar">
        <div>{{ hp.current + ' / ' + hp.max }}</div>
      </div>
    </div>

    <div class="stats">
      <div class="level">
        <strong>Lvl:</strong> <span
          class="integer"
          v-text="player.level"/>
      </div>
      <div class="att_def">
        <!-- Should anything go here? -->
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    player() {
      return this.game.player;
    },
    hp() {
      return {
        current: this.game.player.hp.current,
        max: this.game.player.hp.max,
      };
    },
    getHealthPercentage() {
      return (this.hp.current / this.hp.max) * 100;
    },
    getAttack() {
      return this.game.player.combat.attack;
    },
    getDefence() {
      return this.game.player.combat.defense;
    },
    displayHealthPercentage() {
      return `width:${this.getHealthPercentage}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
$info_text_color: rgb(68, 68, 68);

div.info {
  margin-bottom: auto;
  font-family: "GameFont", serif;
  text-align: left;
  padding: 0 0 0 5px;
  color: $info_text_color;

  span.username {
    font-size: 15px;
  }

  .health {
    margin-top: 0.5em;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #525252;
    background: #e43a3a;
    height: 20px;

    .bar {
      width: 50%;
      height: 100%;
      background: #7cb342;

      div {
        font-size: 10px;
        color: white;
        padding: 2px 0 0 4px;
      }
    }
  }

  .stats {
    strong {
      font-weight: bold;
    }

    .level,
    .att_def {
      margin-top: 0.5em;
      font-size: 12px;

      .def_label {
        margin-left: .5em;
      }
    }

    .level {
      float: left;
    }

    .att_def {
      float: right;
    }

    span.integer {
      color: lighten($info_text_color, 15%);
      margin-left: .5em;
    }
  }
}
</style>

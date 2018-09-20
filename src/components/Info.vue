<template>
  <div class="info" v-if="player">
    <span v-text="player.username"></span>

    <div class="health" v-if="hp">
      <div :style="displayHealthPercentage" class="bar">
        <div>{{ hp.current + ' / ' + hp.max }}</div>
      </div>
    </div>

    <div class="stats">
      <div class="level">
        <strong>Lvl:</strong> <span class="integer" v-text="player.level"></span>
      </div>
      <div class="att_def">
        <strong class="att_label">ATT:</strong>
        <span class="integer" v-text="getAttack.level"></span>

        <strong class="def_label">DEF:</strong>
        <span class="integer" v-text="getDefence.level"></span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['game'],
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
      return this.game.player.skills.filter(s => s.name === 'Attack')[0];
    },
    getDefence() {
      return this.game.player.skills.filter(s => s.name === 'Defence')[0];
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
      background: #3ae43a;

      div {
        font-size: 10px;
        color: white;
        text-shadow: 1px 1px 0 #000;
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

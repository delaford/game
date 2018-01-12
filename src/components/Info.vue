<template>
  <div class="info" v-if="player">
    <span v-text="player.username"></span>

		<div class="health" v-if="hp">
			<div :style="displayHealthPercentage" class="bar"></div>
		</div>

    <div class="stats">
      <div class="level">
        <strong>Lvl:</strong> <span class="integer" v-text="player.level"></span>
      </div>
      <div class="att_def">
        <strong>ATT:</strong> <span class="integer" v-text="player.attack"></span>
        <strong>DEF:</strong> <span class="integer" v-text="player.defence"></span>
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
    displayHealthPercentage() {
      return `width:${this.getHealthPercentage}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
$info_text_color: rgb(68, 68, 68);

@font-face {
  font-family: "GameFont";
  src: url("../assets/fonts/pixelmix.ttf") format("truetype"),
    url("../assets/fonts/pixelmix_bold.ttf") format("truetype");
}

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
    }
  }

  .stats {
    .level,
    .att_def {
      margin-top: 0.5em;
      font-size: 12px;
    }
    .level {
      float: left;
    }
    .att_def {
      float: right;
    }
    span.integer {
      color: lighten($info_text_color, 15%);
    }
  }
}
</style>

<template>
  <div class="settings">
    <div class="section">
      <div class="label">FPS</div>
      <div class="range">
        <input
          v-model="selected.fps"
          type="range"
          min="1"
          max="5"
          steps="1"
          value="1">
      </div>

      <div class="fps-range">
        <div>20</div>
        <div>30</div>
        <div>40</div>
        <div>50</div>
        <div>60</div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';

export default {
  data() {
    return {
      selected: {
        fps: 1,
      },
      fps: [null, 20, 30, 40, 50, 60],
    };
  },
  computed: {
    fpsValue() {
      return this.fps[this.selected.fps];
    },
  },
  watch: {
    'selected.fps': {
      handler() {
        bus.$emit('SETTINGS:FPS', this.fpsValue);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
div.settings {
  height: 100%;
  font-family: "GameFont", sans-serif;
  text-align: left;
  text-shadow: 1px 1px 0 black;
  font-size: 12px;

  div.label {
    margin-bottom: 0.5em;
  }

  input[type="range"] {
    width: 98%;
  }

  div.fps-range {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 10px;
    display: inline-flex;
    justify-content: space-between;

    div {
      display: inline;
      margin: 0;
      padding: 0;
    }
  }
}
</style>

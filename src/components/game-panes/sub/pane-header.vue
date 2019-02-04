<template>
  <div class="header">
    <div
      class="text-header"
      v-text="text"/>
    <div
      class="close"
      @click="close">X</div>
  </div>
</template>

<script>
import bus from '../../../core/utilities/bus';

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      bus.$emit('screen:close');
    },
  },
};
</script>

<style lang="scss" scoped>
$color: #706559;

.header {
  background: lighten($color, 10%);
  height: 30px;
  position: relative;

  .text-header {
    cursor: default;
    text-shadow: 2px 2px 0 black;
    line-height: 27px;
  }

  .close {
    width: 30px;
    cursor: pointer;
    box-sizing: border-box;
    height: 30px;
    background-color: darken(red, 10%);
    color: white;
    font-size: 1em;
    padding: 5px 2px 5px 5px;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>

<template>
  <div class="wear">
    <svg>
      <line x1="77" x2="77" y1="25" y2="190"/>
      <line x1="25" x2="25" y1="130" y2="190"/>
      <line x1="130" x2="130" y1="130" y2="190"/>
      <line x1="137" x2="27" y1="145" y2="145"/>
      <line x1="132" x2="27" y1="93" y2="93"/>
    </svg>

    <div class="wrapper">
      <div class="first_row row">
        <div class="slot head"></div>
      </div>

      <div class="second_row row">
        <div class="slot cape"></div>
        <div class="slot necklace"></div>
        <div class="slot arrows"></div>
      </div>

      <div class="third_row row">
        <div class="slot right"></div>
        <div class="slot torso"></div>
        <div class="slot left"></div>
      </div>

      <div class="fourth_row row">
        <div class="slot gloves"></div>
        <div class="slot boots"></div>
        <div class="slot ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['game'],
};
</script>

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
    top: 0;
    left: 0;
  }

  div.wrapper {
    flex-direction: column;
    align-content: center;
    height: 100%;

    display: grid;
    grid-template-columns: repeat(20, [col-start] 1fr);

    div {
      width: 100%;
    }

    div.slot {
      height: 35px;
      z-index: 10;
      box-sizing: border-box;
      width: 35px;
      margin: 0;
      background-color: darken(darkgrey, 10%);
    }

    div.row {
      display: inline-flex;
      margin-bottom: 1em;
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

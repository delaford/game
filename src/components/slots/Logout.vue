<template>
  <div class="logout">
    <p>Please logout using this button to safely exit the game and save your progress.</p>
    <button class="button is-danger is-big">Logout</button>
  </div>
</template>

<script>
export default {
  props: ['game'],
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main";

div.logout {
  font-family: "UIFont";
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  p {
    text-shadow: 1px 1px 0 #000;
    padding: 0 10px;
  }

  button {
    width: 50%;
  }
}
</style>

<template>
    <div class="chatbox">
      <textarea readonly id="chat">Welcome to Woodhurst.</textarea>

      <input maxlength="50" v-model="said" type="text" class="typing">
    </div>
</template>

<script>
export default {
  data() {
    return {
      said: 'Hello world.',
    };
  },
};
</script>

<style lang="scss" scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  textarea#chat {
    font-family: "ChatFont";
    background-color: #ededed;
    color: #383838;
    padding: 5px;
    width: 100%;
    box-sizing: border-box;
    resize: none;
    border-width: 0;
    outline: none;
    font-size: 13px;
    height: 110px;
  }

  input.typing {
    text-indent: 1px;
    font-family: "ChatFont";
    background-color: #ededed;
    color: #383838;
    padding: 5px;
    margin-top: 5px;
    width: 100%;
    border: 0;
    box-sizing: border-box;
    outline: none;
    font-size: 13px;
  }
}
</style>

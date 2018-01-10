<template>
    <div class="chatbox">
      <div readonly id="chat">
        <div v-for="(chat, i) in chatbox" class="chat"> {{ showChatMessage(chat) }}</div>
      </div>

      <input @keydown.enter="say" maxlength="50" v-model="said" type="text" class="typing">
    </div>
</template>

<script>
export default {
  methods: {
    showChatMessage(chat) {
      let message = '';
      if (chat.type === 'chat') {
        message = `Sir: ${chat.text}`;
      }

      if (chat.type === 'normal') {
        message = chat.text;
      }

      return message;
    },
    say() {
      if (this.sayingSomething) {
        // TODO: Transfer to network code
        const typed = [
          ...this.chatbox,
          {
            type: 'chat',
            text: this.said,
          },
        ];

        Object.assign(this.chatbox, typed);

        this.said = '';
      }
    },
  },
  computed: {
    sayingSomething() {
      return this.said.length >= 1 && this.said.length <= 50;
    },
  },
  data() {
    return {
      said: '',
      chatbox: [
        {
          type: 'normal',
          text: 'Welcome to Navarra.',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  div#chat {
    font-family: "ChatFont";
    background-color: #ededed;
    color: #383838;
    padding: 5px;
    width: 100%;
    text-align: left;
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

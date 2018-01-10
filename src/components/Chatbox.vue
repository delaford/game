<template>
    <div class="chatbox">
      <div readonly id="chat">
        <div v-for="(chat, i) in chatbox" class="message" v-html="showChatMessage(chat)"></div>
      </div>

      <input @keydown.enter="say" maxlength="50" v-model="said" type="text" class="typing">
    </div>
</template>

<script>
export default {
  props: ['game'],
  methods: {
    /**
     * Displays the chat box
     *
     * @param {object} chat A chat message
     */
    showChatMessage(chat) {
      let message = '';

      switch (chat.type) {

        // Standard game
        default:
        case 'normal':
          message = chat.text;
          break;

        // Player chat message
        case 'chat':
          message = `${this.game.player.username}: <span style='color:${chat.color}'>${chat.text}</span>`;
          break;
      }

      return message;
    },
    say() {
      if (this.sayingSomething) {
        // TODO: Transfer to network code
        // Make new chat message object
        const typed = [
          ...this.chatbox,
          {
            type: 'chat',
            color: '#1D56F2',
            text: this.said,
          },

        ];

        // Copy new messages to original object
        Object.assign(this.chatbox, typed);

        // Clear out user input
        this.said = '';

        this.$nextTick(
          () => {
            // Scroll to bottom
            const container = this.$el.querySelector('div#chat');
            container.scrollTop = container.scrollHeight;
          },
        );
      }
    },
  },
  computed: {
    /**
     * Compute whether user said something
     */
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
$background_color: #ededed;
$default_color: #383838;

.chatbox {
  display: flex;
  flex-direction: column;
  div#chat {
    overflow-y: auto;
    font-family: "ChatFont";
    background-color: $background_color;
    color: $default_color;
    padding: 5px;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    resize: none;
    border-width: 0;
    outline: none;
    font-size: 13px;
    height: 110px;

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: darken($background_color, 55%);
    }
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

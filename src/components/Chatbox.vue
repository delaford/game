<template>
  <div
    class="chatbox"
    @click="chatboxClicked">
    <div
      id="chat"
      readonly>
      <div
        v-for="(chat, i) in chatbox"
        :key="i"
        class="message"
        v-html="showChatMessage(chat)"/>
    </div>

    <input
      v-model="said"
      autocomplete="off"
      maxlength="50"
      type="text"
      class="typing"
      @keydown.enter="sendMessage">
  </div>
</template>

<script>
import Socket from '../core/utilities/socket';
import bus from '../core/utilities/bus';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      said: '',
      chatbox: [
        {
          type: 'normal',
          text: 'Welcome to Delaford.',
        },
      ],
    };
  },
  created() {
    bus.$on('player:say', data => this.pipeline(data));
  },
  mounted() {
    bus.$on('item:examine', data => this.pipeline(data));
  },
  methods: {
    /**
     * Transfer messages from other components to chatbox
     *
     * @param {object} data The message to add
     */
    pipeline(incoming) {
      // We have three different types of messages.
      // 1. Chat message - it has `text` key/value (from server)
      // 2. Chat message from action - incoming.data (from client)
      // 3. Examing text from server - incoming.data.data (from server)
      const {
        text, type, username,
      } = Object.hasOwnProperty.call(incoming, 'text') ? incoming : (incoming.data.data || incoming.data);

      // What we'll be appending to chat
      this.said = text;

      // Append to chat
      this.appendChat(type, username);
    },
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
        message = `${chat.username}: <span style='color:${chat.color}'>${chat.text}</span>`;
        break;
      }

      return message;
    },
    /**
     * Send text message to server to send to other players in-game
     */
    sendMessage() {
      Socket.emit('player:say', { said: this.said, id: this.game.player.socket_id });
    },
    /**
     * Add message to chatbox
     *
     * @param {string} type The type of message we are adding
     * @param {string} username The user sending the message
     */
    appendChat(type = 'chat', username = null) {
      const typed = [
        ...this.chatbox,
        {
          type,
          color: '#1D56F2',
          text: this.said,
          username,
        },
      ];

      // Copy new messages to original object
      Object.assign(this.chatbox, typed);

      // Clear user input
      this.clearInput();

      // Scroll chatbox to bottom
      this.scrollToBottom();
    },
    /**
     * Scroll chatbox to bottom on next Vue's life-cycle tick
     */
    scrollToBottom() {
      this.$nextTick(() => {
        // Scroll to bottom
        const container = this.$el.querySelector('div#chat');
        container.scrollTop = container.scrollHeight;
      });
    },
    /**
     * Clear user input
     */
    clearInput() {
      // Clear out user input
      this.said = '';
    },
    chatboxClicked() {
      bus.$emit('contextmenu:close');
    },
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
    font-family: "ChatFont", sans-serif;
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
    font-family: "ChatFont", sans-serif;
    background-color: #ededed;
    color: #383838;
    padding: 5px;
    margin-top: 5px;
    width: 100%;
    border: 0;
    box-sizing: border-box;
    outline: none;
    font-size: 13px;
    border-bottom-left-radius: 3px;
  }
}
</style>

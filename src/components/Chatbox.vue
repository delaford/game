<template>
    <div class="chatbox">
      <div readonly id="chat">
        <div v-for="(chat, i) in chatbox" v-bind:key="i" class="message" v-html="showChatMessage(chat)"></div>
      </div>

      <input autocomplete="off" @keydown.enter="sendMessage" maxlength="50" v-model="said" type="text" class="typing">
    </div>
</template>

<script>
import Socket from '../core/utilities/socket';
import bus from '../core/utilities/bus';

export default {
  props: ['game'],
  created() {
    bus.$on('player:say', data => this.pipeline(data));
  },
  mounted() {
    bus.$on('CHAT:MESSAGE', this.pipeline);
  },
  methods: {
    /**
     * Transfer messages from other components to chatbox
     *
     * @param {object} data The message to add
     */
    pipeline(data) {
      this.said = data.said || data.text;
      this.say(null, data.type, data.username);
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

      // AFTER EXAMINE TEXT
      // DO SAY SO THE VUE ARRAY OF CHATBOX
      // GETS UPDATED

      return message;
    },
    sendMessage() {
      Socket.emit('player:say', { said: this.said, id: this.game.player.socket_id });
    },
    /**
     * Add message to chatbox
     *
     * @param {event} event The event code
     * @param {string} type The type of message we are adding
     */
    say(event, type = 'chat', username = null) {
      // Does our message actually have lines?

      if (this.sayingSomething) {
        // TODO: Transfer to network code
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
      }
    },
    /**
     * Scroll chatbox to bottom on next Vue's life-cycle tick
     */
    scrollToBottom() {
      this.$nextTick(
          () => {
            // Scroll to bottom
            const container = this.$el.querySelector('div#chat');
            container.scrollTop = container.scrollHeight;
          },
        );
    },
    /**
     * Clear user input
     */
    clearInput() {
      // Clear out user input
      this.said = '';
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
    border-bottom-left-radius: 3px;
  }
}
</style>

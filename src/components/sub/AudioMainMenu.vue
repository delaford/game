<!-- eslint-disable -->
<template>
  <div class="container">
    <span @click="togglePlayer">
      <svg
        v-if="isMuted"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path d="M10.434 4.1c-0.347-0.166-0.756-0.119-1.059 0.122l-4.725 3.778h-2.65c-1.103 0-2 0.897-2 2v4c0 1.103 0.897 2 2 2h2.65l4.725 3.781c0.181 0.144 0.403 0.219 0.625 0.219 0.147 0 0.294-0.031 0.434-0.1 0.347-0.166 0.566-0.516 0.566-0.9v-14c0-0.384-0.222-0.734-0.566-0.9zM2 14v-4h3v4h-3zM9 16.919l-3-2.4v-5.037l3-2.4v9.837z"/>
        <path d="M20.206 9.5l-0.706-0.706-2.5 2.5-2.5-2.5-0.706 0.706 2.5 2.5-2.5 2.5 0.706 0.706 2.5-2.5 2.5 2.5 0.706-0.706-2.5-2.5z"/>
      </svg>
      <svg
        v-else
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path d="M10.434 4.1c-0.347-0.166-0.756-0.119-1.059 0.122l-4.725 3.778h-2.65c-1.103 0-2 0.897-2 2v4c0 1.103 0.897 2 2 2h2.65l4.725 3.781c0.181 0.144 0.403 0.219 0.625 0.219 0.147 0 0.294-0.031 0.434-0.1 0.347-0.166 0.566-0.516 0.566-0.9v-14c0-0.384-0.222-0.734-0.566-0.9zM2 14v-4h3v4h-3zM9 16.919l-3-2.4v-5.037l3-2.4v9.837z"/>
        <path d="M18.784 2.1l-0.413-0.284-0.566 0.825 0.413 0.284c2.994 2.056 4.781 5.447 4.781 9.075s-1.788 7.019-4.784 9.075l-0.412 0.284 0.566 0.825 0.413-0.284c3.269-2.244 5.219-5.944 5.219-9.9s-1.95-7.656-5.216-9.9z"/>
        <path d="M21 12c0-2.969-1.462-5.744-3.916-7.425l-0.413-0.281-0.566 0.825 0.412 0.281c2.181 1.494 3.481 3.959 3.481 6.6s-1.3 5.106-3.478 6.6l-0.413 0.281 0.566 0.825 0.413-0.281c2.45-1.681 3.912-4.456 3.912-7.425z"/>
        <path d="M18 12c0-1.978-0.975-3.828-2.606-4.95l-0.412-0.284-0.566 0.825 0.413 0.284c1.359 0.934 2.172 2.475 2.172 4.125s-0.813 3.191-2.175 4.125l-0.412 0.284 0.566 0.825 0.413-0.284c1.634-1.122 2.609-2.972 2.609-4.95z"/>
        <path d="M13.694 9.525l-0.412-0.281-0.563 0.822 0.412 0.281c0.544 0.375 0.869 0.991 0.869 1.65s-0.325 1.275-0.869 1.65l-0.412 0.281 0.566 0.825 0.413-0.281c0.816-0.559 1.306-1.484 1.306-2.475-0.003-0.987-0.491-1.912-1.309-2.472z"/>
      </svg>
    </span>

    <audio id="player" ref="player" loop>
      <source
        src="../../assets/audio/music/main_menu.mp3"
        type="audio/mp3">
    </audio>
  </div>
</template>

<script>
import bus from '../../core/utilities/bus';

export default {
  data() {
    return {
      audio: false,
    };
  },
  computed: {
    /**
     * The source for the player
     */
    player() {
      return this.$refs.player;
    },
    /**
     * Check to see if audio button is muted
     *
     * @returns {boolean}
     */
    isMuted() {
      return this.audio !== 'playing';
    },
  },
  created() {
    bus.$on('music:start', () => this.$nextTick(() => this.startPlayer()));
    bus.$on('music:stop', () => this.$nextTick(() => this.stopPlayer()));
  },
  methods: {
    /**
     * Start the player
     */
    startPlayer() {
      if (!this.audio) {
        this.player.load();
        this.player.play();
        this.audio = 'playing';
      }
    },
    /**
     * Stop the player
     */
    stopPlayer() {
      this.player.pause();
      this.audio = false;
    },
    /**
     * Toggle the music player
     */
    togglePlayer() {
      if (!this.audio) {
        this.player.load();
        this.player.play();
        this.audio = 'playing';
      } else if (!this.player.muted) {
        this.player.muted = true;
        this.audio = 'muted';
      } else {
        this.player.muted = false;
        this.audio = 'playing';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 1em;
  left: 1em;
  margin: 0;
  padding: 0;

  svg {
    cursor: pointer;
  }
}
</style>

<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Logo">

    <!-- Login screen -->
    <div v-show="!loaded || !game" class="wrapper login__screen">

      <div v-if="screen === 'server-down'" class="bg server__down">
        The game server is currently down. Please check the website for more information.
      </div>
      <div v-else class="bg">
        <div v-if="screen === 'register'" class="register">
          To register an account, please visit <a href="https://navarra-rpg.com/register">this page</a> to get start and then come back.
        </div>
        <div v-if="screen === 'login'" class="login">
          <Login></Login>
        </div>
        <div class="button_group"  v-if="screen === 'main'">
          <button @click="screen = 'login'" class="login">
            Login
          </button>

          <button @click="screen = 'register'" class="register">
            Register
          </button>
        </div>
      </div>

    </div>

    <!-- Game wrapper -->
    <div class="wrapper" @click.right="nothing" v-show="loaded && game">
      <div class="left">

        <!-- Main canvas -->
        <GameCanvas :game="game" />

        <!-- Chatbox -->
        <Chatbox :game="game" />
      </div>
      <div class="right">
        <!-- Player overview -->
        <Info :game="game" />

        <!-- Slots (Stats, Wear, Inventory, etc.) -->
        <Slots :game="game" />
      </div>

      <context-menu :game="game"></context-menu>
    </div>
    <!-- End Game wrapper -->
  </div>
</template>

<script>
import GameCanvas from './components/GameCanvas';
import Chatbox from './components/Chatbox';
import Slots from './components/Slots';
import Info from './components/Info';

// Sub Vue components
import ContextMenu from './components/sub/ContextMenu';
import Login from './components/ui/Login';

import Client from './core/client';
import Engine from './core/engine';
import config from './core/config';

import Map from './core/map';

import bus from './core/utilities/bus';

export default {
  name: 'navarra',
  components: {
    GameCanvas, Chatbox, Info, Slots, ContextMenu, Login,
  },
  created() {
    const that = this;
    window.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.event === 'player:joined' || data.event === 'login-data') {
        console.log('incoming:', data);
      }

      switch (data.event) {
        default:
          break;
        case 'player:left':
          if (this.game && this.game.map && this.game.map.players) {
            const playerIndex = this.game.map.players.findIndex(p => data.data === p.uuid);
            this.game.map.players.splice(playerIndex, 1);
          }

          break;
        case 'player:joined':
          setTimeout(() => {
            if (this.game.player) {
              that.game.map.players = data.data
              .filter(p => p.socket_id !== that.game.player.socket_id);
            }
          }, 1000);
          break;
        case 'npc:movement':
          this.npcMovement(data.data);
          break;
        case 'player:movement':
          this.playerMovement(data.data);
          break;
        case 'player:say':
          bus.$emit('player:say', data.data);
          break;
        case 'login-data':
          this.startGame(data.data);
          break;
      }
    };

    window.ws.onerror = () => {
      this.screen = 'server-down';
    };

    bus.$on('player:logout', this.logout);
  },
  data() {
    return {
      config,
      loaded: false,
      game: false,
      screen: 'login',
    };
  },
  methods: {
    logout() {
      this.screen = 'login';
      this.game = false;
    },
    refreshPlayers() {
      // if (data && this.game.player) {
      //   this.game.map.players = data.filter(p => {
      //     return p.socket_id !== this.game.player.socket_id;
      //   });
      // }
    },
    playerMovement(data) {
      if (this.game.player.uuid === data.uuid) {
        this.game.map.player = data;
        this.game.player = data;
      } else {
        const playerIndex = this.game.map.players.findIndex(p => p.uuid === data.uuid);

        this.game.map.players[playerIndex] = data;
      }
    },
    npcMovement(data) {
      if (this.game.npcs) {
        this.game.map.npcs = data;
        this.game.npcs = data;
      }
    },
    async startGame(data) {
      this.game = new Client(data);
      const images = await this.game.start();
      this.game.map = new Map(data.map);
      this.game.map.setImages(images);
      this.game.map.setPlayer(data.player);
      this.game.map.setNPCs(data.npcs);
      this.game.map.setDroppedItems(data.droppedItems);

      // Start game engine
      const engine = new Engine(this.game);
      engine.start();

      setTimeout(() => {
        document.querySelector('canvas#game-map').focus();
      }, 1000);

      this.loaded = true;
    },
    nothing(event) {
      // Make right-click system for
      // rest of the game view.
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css";

#app {
  font-family: "Roboto Slab", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  img.logo {
    margin-bottom: 1em;
  }
  div.login__screen {
    width: 692px;
    border: 5px solid #ababab;
    box-sizing: border-box;
    display: flex;
    height: 505px;
    align-content: center;
    justify-content: center;
    background-image: url("./assets/bg-screen.png");
    div.server__down {
      font-size: 0.85em;
    }
    div.bg {
      background-color: rgba(0, 0, 0, 0.5);
      padding: 1em 0;
      border-radius: 5px;
      display: inline-flex;
      justify-content: space-around;
    }
    div.button_group {
      width: 100%;
      display: inline-flex;
      justify-content: space-around;
      button {
        background: #dedede;
        border: 2px solid darken(#dedede, 10%);
        font-size: 1.5em;
        cursor: pointer;
      }
    }
  }
  div.wrapper {
    background-color: #ababab;
    padding: 5px;
    display: grid;
    grid-template-columns: 512px auto;
    div.right {
      display: flex;
      flex-direction: column;
      position: relative;
      justify-content: flex-end;
      div.content {
        background-color: #c7c7c7;
        height: 100px;
        font-size: 12px;
      }
    }
  }
}
</style>

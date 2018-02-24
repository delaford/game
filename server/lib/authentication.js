const axios = require('axios');
const Socket = require('./../socket');
const world = require('./../core/world');

class Authentication {
  static async login(data) {
    return new Promise(async (resolve) => {
      const token = await Authentication.getToken(data.data);
      const player = await Authentication.getProfile(token);

      resolve({ player, token });
    });
  }

  static getToken(data) {
    const url = `${process.env.SITE_URL}/api/auth/login`;

    return new Promise((resolve) => {
      axios
        .post(url, data)
        .then(r => resolve(r.data.access_token));
    });
  }

  static getProfile(response) {
    const url = `${process.env.SITE_URL}/api/auth/me`;
    const config = {
      headers: { Authorization: `Bearer ${response}` },
    };

    return new Promise((resolve) => {
      axios
        .post(url, null, config)
        .then(r => resolve(r.data));
    });
  }

  static async logout(response) {
    const url = `${process.env.SITE_URL}/api/auth/logout`;
    const config = {
      headers: { Authorization: `Bearer ${response}` },
    };

    return new Promise((resolve) => {
      axios
        .post(url, null, config)
        .then(r => resolve(r.data));
    });
  }

  static addPlayer(player) {
    world.players.push(player);

    const block = {
      player,
      map: world.map,
      npcs: world.npcs,
      droppedItems: world.items,
    };

    Socket.emit('player:login', block);

    Socket.broadcast('player:joined', world.players);
  }
}

module.exports = Authentication;

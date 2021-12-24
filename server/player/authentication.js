import Socket from '@server/socket';
import axios from 'axios';
import world from '@server/core/world';

class Authentication {
  /**
   * Log the player in, get the JWT token and then their profile
   *
   * @param {object} data The username/password sent to the login endpoint
   * @returns {object} Their player profile and token
   */
  static async login(data) {
    return new Promise(async (resolve, reject) => {
      const token = await Authentication.getToken(data.data).catch((error) => {
        reject(error);
      });
      const player = await Authentication.getProfile(token);

      resolve({ player, token });
    });
  }

  /**
   * Logs the player in and returns their JWT token
   *
   * @param {object} data The player credentials
   */
  static getToken(data) {
    const url = `${process.env.SITE_URL}/api/auth/login`;

    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((r) => {
          resolve(r.data.access_token);
        })
        .catch(() => {
          reject(
            new Error({
              error: 401,
              message: 'Username and password are incorrect.',
            }),
          );
        });
    });
  }

  /**
   * Gets the player profile upon login
   *
   * @param {string} token Their JWT authentication token
   */
  static getProfile(token) {
    const url = `${process.env.SITE_URL}/api/auth/me`;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, null, config)
        .then(r => resolve(r.data))
        .catch((error) => {
          console.log(error.response);
          reject(error.response);
        });
    });
  }

  /**
   * Logs the player out and saves the data.
   *
   * @param {string} token Their JWT authentication token
   */
  static async logout(token) {
    const url = `${process.env.SITE_URL}/api/auth/logout`;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, {}, config)
        .then((r) => {
          resolve(r.data);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  /**
   * Adds the player to world and logs them in
   *
   * @param {object} player The player who has just joined the server
   */
  static addPlayer(player) {
    // Add the player
    world.players.push(player);

    // Send back the updated world
    const block = {
      player,
      map: world.map,
      npcs: world.npcs,
      droppedItems: world.items,
    };

    // Tell the client they are logging in
    Socket.emit('player:login', block);

    // Tell the world someone logged in
    Socket.broadcast('player:joined', world.players);
  }
}

module.exports = Authentication;

const axios = require('axios');

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
}

module.exports = Authentication;

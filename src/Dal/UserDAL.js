const AccessData = require('../Services/AccessData');
const User = require('../Util/User.js');
const R = require('ramda');
const CONFIG = require('../Config');

class UserData {

  /**
   * Return a user from the database by his ID
   *
   * @param  {Integer}  userId Id de l'utilisateur à trouver
   * @return {User}            Object user
   */
  static async getUserById(userId) {
    let url = `${CONFIG.API.BOT_BASE_URL}/users/${userId}`;
    return new Promise( (resolve, reject) => {
        AccessData.get(url)
        .then( (data) => {
          console.log(data);
          return resolve(new User(data));
        })
        .catch( (err) => {
          return reject(err);
        });
      });
  }

  /**
   * Return every users in the database
   *
   * @return {Promise<JSON>} Object JSON avec tous les user
   */
  static getAllUser() {
    let url = `${CONFIG.API.BOT_BASE_URL}/users`;

    return new Promise( (resolve, reject) => {
      AccessData.get(url)
        .then( (data) => {
          let users = data['_embedded'].users
          users = R.map((x => new User(x)), users);
          return resolve(users);
        })
        .catch( (err) => {
          return reject(err);
        })
    })
  }

  /**
   * Update the xp and level of a User in the database
   *
   * @param  {User} user  User object with data to update
   * @return {Promise}
   */
  static updateUserXp(user) {
    let url = `${CONFIG.API.BOT_BASE_URL}/users/search/updateUserXp`;
    url += `?id=${user.id}&xp=${user.xp}&level=${user.level}`;

    return new Promise( (resolve, reject) => {
      AccessData.get(url)
        .then( (data) => {
          return resolve(data);
        })
        .catch( (err) => {
          return reject(err);
        })
    })
  }

}

module.exports = UserData;

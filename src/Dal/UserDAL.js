const AccessData = require('../Services/AccessData');
const User = require('../Util/User.js');
const R = require('ramda');
const CONFIG = require('../Config');

class UserDAL {

  /**
   * Return a user from the database by his ID
   *
   * @param  {Integer}  userId Id de l'utilisateur à trouver
   * @return {User}            Object user
   */
  static async getUserById(userId) {
    let url = `${CONFIG.API.BOT_BASE_URL}/user/${userId}`;
    return new Promise( (resolve, reject) => {
        AccessData.get(url)
        .then( (data) => {
          let u = new User(data);
          return resolve(u);
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
          let users = data;
          users = R.map((x => new User(x)), users);
          return resolve(users);
        })
        .catch( (err) => {
          return reject(err);
        })
    })
  }

  static createUser(user) {
    let url = `${CONFIG.API.BOT_BASE_URL}/user`;
    
    return new Promise( (resolve, reject) => {
      AccessData.post(url, {
        "id": user.id,
        "nickname": user.nickname,
        "level": user.level,
        "xp": user.xp,
        "ts_last_xp": undefined,
        "admin": false,
        "username": user.username,
        "discriminator": user.discriminator
      }).then( (data) => {
          let u = new User(data);
          return resolve(u);
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
    let url = `${CONFIG.API.BOT_BASE_URL}/user/${user.id}`;

    return new Promise( (resolve, reject) => {
      AccessData.put(url, {
        "nickname": user.nickname,
        "username": user.username,
        "discriminator": user.discriminator,
        "xp": user.xp,
        "level": user.level
      }).then( (data) => {
          return resolve(data);
        })
        .catch( (err) => {
          return reject(err);
        })
    })
  }

}

module.exports = UserDAL;

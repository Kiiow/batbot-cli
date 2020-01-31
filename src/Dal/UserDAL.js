const AccessData = require('../Services/AccessData');
const User = require('../Util/User.js');
const R = require('ramda');

class UserData {

  /**
   * Retourne un utilisateur du fichier JSON en fonction de son id
   * @param  {Integer}  userId Id de l'utilisateur à trouver
   * @return {User}         Object JSON de l'utilisateur
   */
  static async getUserById(userId) {
    const USER_DATA = await AccessData.ReadJSONFile('user')
      .then( (data) => {
        let myUser = R.find(R.propEq('id', userId))(data.users || []);
        return myUser;
      })
    let user = new User(USER_DATA);
    return user;
  }

  /**
   * Retourne tous les utilisateur du fichier JSON
   * @return {Promise<JSON>} Object JSON avec tous les user
   */
  static async getAllUser() {
    const USERS = await AccessData.ReadJSONFile('user')
      .then( (data) => {
        const createUser = item => new User(item);
        let users = R.map(createUser, data.users);
        return users;
      });
    return USERS;
  }

}

module.exports = UserData;

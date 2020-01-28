const AccessData = require('./AccessData');
const User = require('../Util/User.js');
const R = require('ramda');

class UserData {

  static async getUserById(userId) {
    const USER_DATA = await AccessData.ReadJSONFile('user')
      .then( (data) => {
        let myUser = R.find(R.propEq('id', userId))(data.users || []);
        return myUser;
      });
    let user = new User(USER_DATA);
    return user;
  }

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

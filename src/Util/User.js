
/**
 * User class
 */
class User {

  /**
   * Constructor of user
   * @param {JSONObject} userData [Data of the user]
   */
  constructor(userData) {
    this.id = userData.id;
    this.nickname = userData.nickname;
    this.level = userData.level;
    this.xp = userData.xp;
    this.admin = userData.admin;
    this.username = userData.username;
    this.discriminator = userData.discriminator;
    this.nickname = userData.nickname;
  }

  /**
   * Display the user informations in a json format
   * @return {JSONObject} [JSONObject of the user]
   */
  toJson() {
    return {
			'id': this.id,
			'nickname': this.nickname,
			'level': this.level,
			'xp': this.xp,
			'admin': this.admin,
			'username': this.username,
			'discriminator': this.discriminator,
		}
  }

  /**
   * Check if the user is admin
   * @return {Boolean} [True if the user is an admin false otherwise]
   */
  isAdmin() { return this.admin == 1; }

  /**
   * Display the fullName of the user
   * @return {String} [fullName of the user (username#discriminator)]
   */
  fullName() { return `${this.username}#${this.discriminator}`; }

}

module.exports = User;

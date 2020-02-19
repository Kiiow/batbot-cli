
/**
 * User class
 */
class User {

  /**
   * Constructor of user
   * @param {JSONObject} userData [Data of the user]
   */
  constructor(userData) {
    this.id = (userData.id || undefined);
    this.nickname = (userData.nickname || undefined);
    this.level = (userData.level || undefined);
    this.xp = (parseInt(userData.xp) || undefined);
    this.ts_last_xp = (userData.ts_last_xp || undefined);
    this.admin = (userData.admin || undefined);
    this.username = (userData.username || undefined);
    this.discriminator = (userData.discriminator || undefined);
  }

  /**
   * Display the user informations in a json format
   * @return {JSONObject} JSONObject of the user
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
   * @return {Boolean} True if the user is an admin false otherwise
   */
  isAdmin() { return this.admin == 1; }

  /**
   * Display the fullName of the user
   * @return {String} fullName of the user (username#discriminator)
   */
  fullName() { return `${this.username}#${this.discriminator}`; }

}

module.exports = User;

const CONFIG = require('../Config');
const UserDal = require('../Dal/UserDAL');
const LevelService = require('./Level/LevelService');
const MessageSender = new (require('./MessageSender'))(undefined);

class LevelManager {

  constructor(message, bot) {
    this.message = message;
    this.bot = bot;
  }

  /**
   * Check if the user can earn xp with this message
   *
   * @return {Boolean}
   */
  canEarnXp() {
    if(this.message.author.bot) return false;
    if (this.message.content.startsWith(CONFIG.BOT.PREFIX)) return false;
    if (this.message.content.startsWith(`<@!${this.bot.user.id}>`)) return false;
    if (this.message.content.length <= 15) return false;
    return true;
  }

  /**
   * Recup the user in database, and add xp to the object
   *
   * @return {Promise} User object updated with what needed to be done
   */
  addXp() {
    return new Promise( (resolve, reject) => {
      UserDal.getUserById(this.message.author.id)
        .then( async (user) => {
          if(user.id == undefined) { // If the user does not exist in the database
            let discordUser = {
              "id": this.message.author.id,
              "nickname": (this.message.member != null ? this.message.member.nickname : this.message.author.username),
              "level": 1,
              "xp": 0,
              "username": this.message.author.username,
              "discriminator": this.message.author.discriminator
            }
            user = await UserDal.createUser(discordUser);
          } else { // Update userInformation if the user exist
            user.username = this.message.author.username;
            user.discriminator = this.message.author.discriminator;
            
            if(this.message.member != null) user.nickname = this.message.member.nickname;
            else user.nickname = this.message.author.username;
          }
          const wait = 40;
          // Check if last message ts wa more than 40sec from now
          if((new Date().getTime()+3600000) <= (new Date(user.ts_last_xp).getTime() + wait*1000) ) {
            return reject();
          }
          const xpToAdd = LevelService.calcXp(this.message.content.length);
          if(user.xp == undefined) user.xp = xpToAdd
          else user.xp += xpToAdd;

          while(user.xp > LevelService.xpNeed(user.level)) {
            user.level ++;
            this.sendLevelUp(user.level);
          }

          return resolve(user);
        })
        .catch( (err) => {
          return reject(err);
        })
    });
  }

  /**
   * Send levelUp message
   */
  sendLevelUp(level) {
    MessageSender.setMessage(this.message).sendEmbed({
      color: 3376639,
      author_name : this.message.author.username,
      author_avatar : this.message.author.avatarURL,
      description: 'Bravo vous êtes désormais niveau ' + level
    });
  }

}

module.exports = LevelManager;

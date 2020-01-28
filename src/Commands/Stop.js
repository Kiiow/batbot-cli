const Command = require('../Command');
const UserData = require('../Services/UserData');

/**
 * Stop class
 * @extends Command
 */
class Stop extends Command {

  /**
   * Stop the bot if the user is an admin
   * @param  {Discord.message}  message Message of the user
   */
  static async action(message){
    message.delete();
    let userId = message.author.id;
    let user = await UserData.getUserById(userId);

    if(user.isAdmin()) {
      this.msg(message).sendBack(`A bientôt ...`);
      setTimeout( () => {
        this.log(2, `Stopping ${this.getConfig().BOT.NAME}`);
        process.exit();
      });
    } else {
      this.log(2, `User ${user.fullName()} is not admin`);
    }
  }

}

module.exports = Stop

const Command = require('../Command');
const UserDAL = require('../Dal/UserDAL');

/**
 * Stop class
 * @extends Command
 */
class Stop extends Command {

  /**
   * Stop the bot if the user is an admin
   * @param  {Discord.message}  message User message
   * @return {Promise}                  Promise
   */
  static async action(message){
    message.delete();
    let userId = message.author.id;
    let user = await UserDAL.getUserById(userId);

    if(user.isAdmin()) {
      this.log(2, `Stopping ${this.getConfig().BOT.NAME}`);
      this.msg(message).sendBack(`A bientôt ...`)
        .then( () => { process.exit() });
    } else {
      this.msg(message).sendError(`Vous devez être admin pour ça`)
      this.log(2, `User ${user.fullName()} is not admin`);
    }
  }

}

module.exports = Stop

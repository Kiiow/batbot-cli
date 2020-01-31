const Command = require('../Command');
const UserDAL = require('../Dal/UserDAL');

class Clear extends Command{

  /**
   * Clear a certain number of message if the user is authorized to
   * @param  {Discord.message}  message User message
   * @return {Promise}                  Promise
   */
  static async action(message) {
    this.log(2, `Trying to clear some message`);
    let user = await UserDAL.getUserById(message.author.id);
    if(user.isAdmin()) {
      let nbMessageToDelete = parseInt(message.content.split(' ')[1]);
      if(!isNaN(nbMessageToDelete)) {
        message.channel.bulkDelete(nbMessageToDelete+1)
          .then( () => { this.log(2, `Deleted ${nbMessageToDelete}msg`) })
          .catch( (error) => {
            this.getLogger().contextAdd('ERR', error);
            this.log(0, `Error while trying to delete messages`);
            this.getLogger().contextRemoveLast();
          })
      } else {
        this.msg(message).sendError("ERROR ALED FAUT METTRE UN NOMBRE DE MESSAGE A SUPPRIMMER")
        this.log(5, `Well i'm there and i don' know why....`);
      }
    } else {
      this.msg(message).sendError(`Seul les admins peuvent effacer des messages`);
    }
  }

}

module.exports = Clear

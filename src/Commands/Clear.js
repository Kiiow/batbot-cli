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
    await message.delete();
    if(user.isAdmin()) {
      let nbMessageToDelete = parseInt(message.content.split(' ')[1]);

      if(!isNaN(nbMessageToDelete) && nbMessageToDelete > 0 && nbMessageToDelete < 100) {

        message.channel.bulkDelete(nbMessageToDelete)
          .then( () => { this.log(2, `Deleted ${nbMessageToDelete} msg`) })
          .catch( (error) => {
            this.msg(message).sendError(`Erreur lors de la suppression des messages, je ne peux pas supprimmer des messages vieux de plus de 2 semaines.`)
            this.log(0, `Error while trying to delete messages`, error);
          })
      } else {
        this.log(1, `First parameter ("${message.content.split(' ')[1]}") isNaN or is : 0 < nbMessageToDelete < 100`);
        this.msg(message).sendError("Vous devez spécifier un nombre de message à supprimer (0 < nbMessage < 100)");
      }
    } else {
      this.log(0, `Only admin users are authorised to delete message`)
      this.msg(message).sendError(`Seul les admins peuvent effacer des messages`);
    }
  }

}

module.exports = Clear

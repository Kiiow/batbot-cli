const Command = require('../../Command.js');
const UserDAL = require('../../Dal/UserDAL.js');
const R = require('ramda');

class Bot extends Command {

  static action(message, bot) {
    let action = message.content.split(' ')[1];
    let command = message.content.split(' ')[2];

    switch(action) {
      case "set":
        switch(command) {
          case "presence":
            this.setPresence(message, bot);
            break;
          default:
            this.msg(message).sendError(`La commande '${command}' n'est pas une commande valide`);
            this.log(1, `Unkown command (${command})`);
            break;
        }
        break;
      default:
        this.displayHelpDefault(message);
        break
    }
  }

  static displayHelpDefault(message) {
    this.log(2, `Display help on Bot commands`);
    const HELP_DEFAULT = {
      'fields': [
        {
          'name': `Commandes \`${this.getConfig().BOT.PREFIX}bot\` : `,
          'value': `\n**:pager: \`${this.getConfig().BOT.PREFIX}bot set presence --game <text> --type <type> --status <>\`** -- Définit le message de présence du bot`
        }
      ]
    };

    this.msg(message).sendEmbed(HELP_DEFAULT);
  }

  static async setPresence(message, bot) {
    let user = await UserDAL.getUserById(message.author.id);
    if(user.isAdmin()) {
      this.log(2, `${user.fullName()} is changing the presence of the bot`);

      let obj = {}
      let data = R.drop(3, message.content.split(' '));
      data = R.drop(1, data.join(' ').split('--'));
      for (let param of data) {
        param = param.split(' ');
        obj[param[0]] = (R.drop(1, param).join(' ')).trim();
      }
      let presence = { 'game': { } }

      if(obj.game != undefined !=obj.game.toString().trim() != "") {presence.game.name = obj.game;}
      else { presence.game.name = bot.user.presence.game.name; }

      let typeList = ['PLAYING', 'WATCHING', 'STREAMING', 'LISTENING'];
      if(obj.type != undefined && typeList.indexOf(obj.type.toString().toUpperCase()) != -1) {presence.game.type = obj.type;}
      else {presence.game.type = bot.user.presence.game.type;}

      let statusList = ['online', 'idle', 'invisible', 'dnd'];
      if(obj.status != undefined && statusList.indexOf(obj.status.toString().toLowerCase()) != -1) {
        presence.status = obj.status;
      } else {presence.status = bot.user.presence.status;}

      bot.user.setPresence(presence);
      this.getLogger().contextAdd('PRESENCE', presence);
      this.log(2, `Bot presence changed`)
      this.getLogger().contextRemove('PRESENCE');
    } else {
      this.log(1, `Trying to set bot presence`);
      this.msg(message).sendError(`Vous devez être admin pour utiliser cette commande`);
    }
  }

}

module.exports = Bot;

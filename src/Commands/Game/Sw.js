const Command = require('../../Command');
const MobsInfos = require('./SW/MobsInfos');

class Sw extends Command {

  static action(message) {
    message.delete();
    this.PREF = this.getConfig().BOT.PREFIX;
    let param = message.content.split(' ')[1];
    this.log(2, `Asking for information about ${param || "default"}`)
    switch(param) {
      case "info":
        MobsInfos.action(message);
        break;
      default:
        this.displaySwHelp(message);
        break;
    }
  }

  static displaySwHelp(message) {
    this.msg(message).sendEmbed({
      'fields': [
        {
          'name': `Commande(s) \`${this.PREF}sw\``,
          'value': `**:newspaper:\`${this.PREF}sw info <monster> (n°)\`** -- Affiche les informations du/des mob(s)`
        }
      ]
    })
  }

}

module.exports = Sw

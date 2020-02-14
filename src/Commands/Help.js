const Command = require('../Command');
const AccessData = require('../Services/AccessData');
const R = require('ramda');

class Help extends Command {

  /**
   * Send help about the bot
   * @param  {Discord.message} message User message
   */
  static action(message){
    message.delete();
    this.message = message;
    this.PREF = this.getConfig().BOT.PREFIX;
    let helpCategAksed = message.content.split(' ')[1];
    this.log(2, `Asking for some help about ${helpCategAksed || "nothing"}`);
    switch(helpCategAksed) {
      case "general":
        this.displayHelpFor("general");
        break;
      case "admin":
        this.displayHelpFor("admin");
        break;
      case "game":
        this.displayHelpFor("game");
        break;
      case "all":
        this.displayHelpFor("all");
        break;
      default:
        this.displayHelpDefault();
        break;
    }
  }

  /**
   * Display default help
   */
  static displayHelpDefault() {
    const HELP_DEFAULT = {
      'fields': [
        {
          'name': `Commandes \`${this.PREF}help\` : `,
          'value': `\n**:gear: \`${this.PREF}help general\`** -- Donne l'aide sur les commandes général` +
                   `\n**:tools: \`${this.PREF}help admin\`** -- Donne l'aide sur les commandes admin` +
                   `\n**:video_game: \`${this.PREF}help game\`** -- Donne l'aide sur les commandes de jeu` +
                   `\n**:hammer_pick: \`${this.PREF}help all\`** -- Donne l'aide sur toutes les commandes`
        }
      ]
    };

    this.msg(this.message).sendEmbed(HELP_DEFAULT);
  }

  /**
   * Display help for a categorie
   * @param  {String} categorie Name of the categorie
   */
  static displayHelpFor(categorie){
    const FILTER_CATEG = categ => categ.help_data.category === categorie;
    const MAP_COMMAND_INFO = item => {
      let text = `**:${item.help_data.icon}: \`${this.PREF}${(item.help_data.command || item.name)}\`** -- ${item.help_data.text}`;
       if(!item.active_command) { text = `~~${text}~~`; }
      return text
    };

    AccessData.readJSONFile("commands")
      .then((data) => {
        let commandsFiltered;
        let commands = [];
        if(categorie != "all") {
          commandsFiltered = R.filter(FILTER_CATEG, data.Commands);
          commands.push({
            'name': `► Commandes ${categorie}`,
            'value': R.map(MAP_COMMAND_INFO, commandsFiltered).join('\n')
          });
        } else {
          let commandsData = {};
          for (let command of data.Commands) {
            let category = command.help_data.category;
            if(commandsData[category] === undefined) {
              commandsData[category] = []
            } else {
              commandsData[category].push(MAP_COMMAND_INFO(command))
            }
          }
          for (let [key, value] of Object.entries(commandsData)) {
            commands.push({
                'name': `► Commandes ${key}`,
                'value': value.join('\n')
              });
          }
        }

        const HELP_INFO = { 'fields': commands };
        this.msg(this.message).sendEmbed(HELP_INFO);
      })
      .catch((error) => {
        this.msg(this.message).sendError(`ERROR ${error.message}`);
      });
  }

}

module.exports = Help;

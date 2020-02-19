const Command = require('../Command');
const AccessData = require('../Services/AccessData');
const CommandsDAL = require('../Dal/CommandsDAL');
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
    const FILTER_CATEG = item =>{
      console.log(item)
      return item.category.libelle === categorie
    };
    const MAP_COMMAND_INFO = item => {
      let text = `**:${item.help_data.icon}: \`${this.PREF}${(item.help_data.example || item.name)}\`** -- ${item.help_data.text_FR}`;
       if(!item.active) { text = `~~${text}~~`; }
      return text
    };

    // AccessData.readJSONFile("commands")
    CommandsDAL.getAllCommands()
      .then((data) => {
        let commandsFiltered = [];
        let commands = [];
        if(categorie != "all") { // Si une catégorie spécifique
          commandsFiltered = R.filter(FILTER_CATEG, data);
          commands.push({
            'name': `► Commandes ${categorie}`,
            'value': R.map(MAP_COMMAND_INFO, commandsFiltered).join('\n')
          });

        } else { // Si toutes les catégories
          let commandsData = {};
          for (let command of data) {
            let category = command.category.libelle;
            if(commandsData[category] === undefined) {
              commandsData[category] = []
            }
            commandsData[category].push(MAP_COMMAND_INFO(command))
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
        this.log(0, `Error while trying to display every commands`, error);
        this.msg(this.message).sendError(`ERROR ${error.message}`);
      });
  }

}

module.exports = Help;

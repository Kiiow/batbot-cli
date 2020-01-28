const Command = require('../Command.js');
const AccessData = require('../Services/AccessData');
const R = require('ramda');

class Help extends Command {

  static action(message){
    this.message = message;
    message.delete();
    let helpCategAksed = message.content.split(' ')[1];
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

  static displayHelpDefault() {
    const HELP_DEFAULT = {
      'fields': [
        {
          'name': "Commandes `.help` : ",
          'value': "\n**:gear: `.help general`** -- Donne l'aide sur les commandes général" +
                   "\n**:tools: `.help admin`** -- Donne l'aide sur les commandes admin" +
                   "\n**:video_game: `.help game`** -- Donne l'aide sur les commandes de jeu" +
                   "\n**:hammer_pick: `.help all`** -- Donne l'aide sur toutes les commandes"
        }
      ]
    };

    this.msg(this.message).sendEmbed(HELP_DEFAULT);
  }

  static displayHelpFor(categorie){
    const FILTER_CATEG = categ => categ.help_data.category === categorie;
    const MAP_COMMAND_INFO = item => `**:${item.help_data.icon}: \`.${item.name}\`** -- ${item.help_data.text}`;

    AccessData.ReadJSONFile("commands")
      .then((data) => {
        let commandsFiltered;
        if(categorie.trim() != "all") {
          commandsFiltered = R.filter(FILTER_CATEG, data.Commands);
        } else {
          commandsFiltered = data.Commands;
        }

        let commands = R.map(MAP_COMMAND_INFO, commandsFiltered).join('\n');
        const HELP_INFO = {
          'fields': [
            {
              'name': `Commandes ${categorie}`,
              'value': commands
            }
          ]
        };
        this.msg(this.message).sendEmbed(HELP_INFO);
      })
      .catch((error) => {
        this.msg(this.message).sendError(`ERROR ${error.message}`);
      });
  }
}

module.exports = Help;

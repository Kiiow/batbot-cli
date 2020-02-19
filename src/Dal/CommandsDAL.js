const R = require('ramda');

const CONFIG = require('../Config');
const AccessData = require('../Services/AccessData');
const Command = require('../Util/Command');

class CommandsDAL {

  /**
   * Return the list of every commands
   *
   * @return {Array<JSON>} Array of every commands
   */
  static getAllCommands() {
    let url = `${CONFIG.API.BOT_BASE_URL}/commands`;
    let TRANSFORM_COMMANDS = x => {
      return new Command(x)
    };

    return new Promise( (resolve, reject) => {
      AccessData.get(url)
        .then((data) => {
          let commandList = data['_embedded'].commands;
          commandList = R.map(TRANSFORM_COMMANDS, commandList)
          return resolve(commandList);
        })
        .catch( (err) => {
          return reject(err);
        })
    });
  }

}


module.exports = CommandsDAL

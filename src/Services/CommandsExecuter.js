
/**
 * Class CommandsExecuter
 */
class CommandsExecuter {

  /**
   * Constructor of CommandsExecuteur
   * @param {Discord.message} message User message to analyze
   */
  constructor(message) {
    this.message = message;
  }

  /**
   * Execute a command
   * @param {JSON} DATA Object with data of the command
   *
   * @return {Promise} Promise
   * @resolve Do something after executing the command
   * @reject  Do something if the command fail
   */
  ExecuteCommand(DATA) {
    return new Promise((resolve,reject) => {
      try {
        const commandToExecute = require("../Commands/" + DATA.filename);
        commandToExecute[DATA.function](this.message);
        resolve();
      } catch (error) {
        reject(error);
      }
    })

  }

}

module.exports = CommandsExecuter;

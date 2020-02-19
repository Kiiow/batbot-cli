const { NotAnActiveCommandError } = require('./Error/Errors');

/**
 * Class CommandsExecuter
 */
class CommandsExecuter {

  /**
   * Constructor of CommandsExecuteur
   *
   * @param {Discord.message} message User message to analyze
   * @param {Discord.Client}  bot     Instance of the bot
   */
  constructor(message, bot) {
    this.message = message;
    this.bot = bot;
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
        if(!DATA.active) {
          this.message.channel.send(`Command \`${DATA.name}\` is not an active command`);
          throw new NotAnActiveCommandError(`This is not an active command`);
        }
        const commandToExecute = require(`../Commands/${DATA.filename}`);
        commandToExecute[`${DATA.function || "action"}`](this.message, this.bot);
        resolve();
      } catch (error) {
        reject(error);
      }
    })

  }

}

module.exports = CommandsExecuter;

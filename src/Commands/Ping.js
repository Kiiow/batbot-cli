const Command = require('../Command.js');

/**
 * Ping class
 * @extends Command
 */
class Ping extends Command {

  /**
   * Play pingpong with the bot
   * @param  {Discord.message} message User message to use
   */
  static action(message){
    this.msg(message).sendBack('Pong :ping_pong:');
    this.log(2, `Pinging ${this.getConfig().BOT.NAME}`);
  }
}

module.exports = Ping;

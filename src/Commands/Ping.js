const Command = require('../Command');

/**
 * Ping class
 * @extends Command
 */
class Ping extends Command {

  /**
   * Play pingpong with the bot
   * @param  {Discord.message} message User message
   */
  static async action(message, Bot){
    let m = await this.msg(message).sendBack('Pong :ping_pong:');
    this.log(2, `Pinging ${this.getConfig().BOT.NAME}`);
    this.log(4, `Bot latency is ${m.createdTimestamp - message.createdTimestamp}, API latency is ${Bot.ping}`);
  }
}

module.exports = Ping;

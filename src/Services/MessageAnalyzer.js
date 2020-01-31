const R = require('ramda');

const AccessData = require('./AccessData');
const CONFIG = require('../Config');

class MessageAnalyzer {

  constructor(message, Bot) {
    this.message = message;
    this.bot = Bot;
  }

  /**
   * Check if the message correspond to a command
   * @resolve Data about the command
   * @reject  Error If user = bot, If channel = dm, If unkown command
   */
  AnalyzeMsg() {
    return new Promise((resolve, reject) => {
      if(this.IsBotUser(this.message)) {
        // NOTE If need to do something with botMsg
      }else if(this.IsChannelTypeDM(this.message)){
        reject(Error("Not a correct channel ! trying to use command in DM"));

      } else if(this.MsgStartWith(this.message, CONFIG.BOT.PREFIX)){
          let possibleCommand = this.message.content.split(' ')[0]
          possibleCommand = R.drop(CONFIG.BOT.PREFIX.length, possibleCommand)

          AccessData.ReadJSONFile('commands')
            .then( (data) => {
              let commandData = this.isMsgCommand(possibleCommand, data.Commands);
              if(commandData){
                resolve(commandData);
              } else {
                reject(Error("Unkown command"));
              }
            })
            .catch( (error) => {
              reject(error);
            })

      }
    });
  }

  /**
   * Analayze if message starts with prefix or bot mention
   * If start with bot mention replace it with prefix
   *
   * @param {[Discord.message]} message [Message discord to analyze]
   * @param {[String]}          prefix  [Prefix to execute bot command]
   *
   * @return {[Boolean]}                [True if the message could be a command]
   */
  MsgStartWith(message, prefix) {
    let isPrefixCorrect = message.content.startsWith(prefix);
    let isMentionned = message.content.startsWith('<@!' + this.bot.user.id + '>');

    if(isMentionned){
      this.message.content = message.content.replace('<@!' + this.bot.user.id + '> ', prefix);
    }
    return  isPrefixCorrect || isMentionned
  }

  isMsgCommand(possibleCommand, commandsArr) {
    return R.find(R.propEq('name', possibleCommand))(commandsArr)
  }

  /**
   * True if the user is a bot false otherwise
   * @param {[Discord.message]} message [Message discord send]
   */
  IsBotUser(message) {
    return message.author.bot;
  }

  IsChannelTypeDM(message) {
    return message.channel.type === "dm";
  }
}

module.exports = MessageAnalyzer;

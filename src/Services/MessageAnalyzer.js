const R = require('ramda');

const {UnkownCommandError, NotANormalUserError, NotACorrectChannelError} = require('./Error/Errors');
const AccessData = require('./AccessData');
const CONFIG = require('../Config');
const CommandsDal = require('../Dal/CommandsDAL');

class MessageAnalyzer {

  constructor(message, Bot) {
    this.message = message;
    this.isCommand = false;
    this.bot = Bot;
  }

  /**
   * Check if the message correspond to a command
   *
   * @return {Promise}
   * @resolve Data about the command
   * @reject  Error If user = bot, If channel = dm, If unkown command
   */
  AnalyzeMsg() {
    return new Promise((resolve, reject) => {
      if(!this.MsgStartWith(this.message, CONFIG.BOT.PREFIX)){
        return reject();
      }
      let userInfo = {'id': this.message.author.id, 'username': this.message.author.username}
      if(this.IsBotUser(this.message)) {
        return reject(new NotANormalUserError("A bot is trying to use commands", userInfo))

      }else if(this.IsChannelTypeDM(this.message)){
        return reject(new NotACorrectChannelError("Not a correct channel ! trying to use command in DM or group DM", userInfo));

      } else if(this.MsgStartWith(this.message, CONFIG.BOT.PREFIX)){
          let possibleCommand = this.message.content.split(' ')[0]
          possibleCommand = R.drop(CONFIG.BOT.PREFIX.length, possibleCommand)

          CommandsDal.getAllCommands()
            .then( (data) => {
              let commandData = this.isMsgCommand(possibleCommand, data);
              if(commandData){
                this.isCommand = true;
                return resolve(commandData);
              } else {
                this.isCommand = false;
                return reject(new UnkownCommandError(`Unkown command "${possibleCommand}"`));
              }
            })
            .catch( (error) => {
              this.isCommand = false;
              return reject(error);
            })

      }
    });
  }

  /**
   * Analayze if message starts with prefix or bot mention.
   *  If start with bot mention replace it with prefix
   * @param {Discord.message} message Message discord to analyze
   * @param {String}          prefix  Prefix to execute bot command
   * @return {Boolean}                True if the message could be a command
   */
  MsgStartWith(message, prefix) {
    let isPrefixCorrect = message.content.startsWith(prefix);
    let isMentionned = message.content.startsWith(`<@!${this.bot.user.id}>`);

    if(isMentionned){
      this.message.content = message.content.replace(`<@!${this.bot.user.id}> `, prefix);
    }
    return  isPrefixCorrect || isMentionned
  }

  isMsgCommand(possibleCommand, commandsArr) {
    return R.find(R.propEq('name', possibleCommand))(commandsArr)
  }

  /**
   * True if the user is a bot false otherwise
   * @param {Discord.message} message Message discord send
   */
  IsBotUser(message) {
    return message.author.bot;
  }

  IsChannelTypeDM(message) {
    return message.channel.type === "dm" || message.channel.type === "group";
  }
}

module.exports = MessageAnalyzer;

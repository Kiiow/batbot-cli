const GlobalFunc = new (require('../function/globalFunc'))();
const MsgFunc = new (require('../function/msgFunc'))();
const AdminFunc = new (require('../function/adminFunc'));

const MessageSender = new (require('./Services/MessageSender'))(undefined);
const Logger = require('./LoggerFactory');
const CONFIG = require('./Config');

/**
 * Command class
 */
class Command {

  /**
   * Send a log message and save it in a logs file
   * @param  {int}      level   Level of the log
   * @infos             level   [-1: FATAL, 0: ERROR, 1: WARN, 2: INFO, 3: SUCCESS, 4: DEBUG, 5: MORE]
   * @param  {String}   message Message to log
   */
  static log(level, message){ Logger.log(level, `[${this.name}] ` + message); }

  /**
   * Return the logger object
   * @return {Logger} Logger of the application
   */
  static getLogger(){ return Logger; }

  /**
   * Return the config of the bot
   * @return {JSONObject} Informations about the bot execution
   */
  static getConfig(){ return CONFIG; }

  /**
   * Allow to send response in discord
   * @param  {Discord.message} message  Message discord
   *
   * @return {MessageSender}            Object that allow to sendBack message
   */
  static msg(message) {
    MessageSender.setMessage(message);
    return MessageSender;
  }

  // TODO Refaire global admin et msg correctement dans différents services
  static global(){ return GlobalFunc; }
  static msgFunc(){ return MsgFunc; }
  static admin(){ return AdminFunc; }
}

module.exports = Command;

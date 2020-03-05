const MessageSender = new (require('./MessageSender'))(undefined);
const Logger = require('../LoggerFactory');
const AccessData = require('./AccessData');
const R = require('ramda');
const CONFIG = require('../Config');
const GOOGLE_API_URL = "https://api.dialogflow.com/v1/query";

class Brain {

  constructor(message, Bot) {
    this.message = message;
    this.bot = Bot;
  }

  ThinkAndSpeak() {
    Logger.log(5, '[Brain] Analyzing message for AI response');
    return new Promise( (resolve, reject) => {
      if(!this.messageContainMention()) {
        return reject();
      } else {
        Logger.log(2, `[Brain] Speaking to BatBot`);
        let body = {
        	"v": 20150910,
        	"lang": "fr",
        	"query": this.message.content.replace(CONFIG.BOT.PREFIX, ""),
        	"sessionId": "123456789",
        	"timezone": "Europe/Paris"
        }
        AccessData.post(GOOGLE_API_URL, body, { 'Authorization': `Bearer ${CONFIG.API.GOOGLE_AI_TOKEN}`})
          .then( (data) => {
            Logger.log(2, `[Brain] Bot answering`);
            return resolve(this.Speak(data));
          })
          .catch( (err) => {
            return reject(err);
          })
      }
    });
  }

  Speak(data) {
    let response = data.result.fulfillment.speech;
    MessageSender.setMessage(this.message).sendBack(response);
  }

  messageContainMention() {
    let usersMentions = this.message.mentions.users;
    let data = R.find(R.propEq('id', this.bot.user.id))(usersMentions);
    return data != undefined;
  }

}

module.exports = Brain;

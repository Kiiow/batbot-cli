const MessageSender = new (require('./MessageSender'))(undefined);
const Logger = require('../LoggerFactory');
const AccessData = require('./AccessData');
const { sleep } = require('./BasicFunc');

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
            return resolve(data);
          })
          .catch( (err) => {
            return reject(err);
          })
      }
    });
  }

  async TreatmentData(data) {

    let botResponse = data.result.fulfillment.speech;
    let action = botResponse.split(' ')[0];
    // console.log(`"${action}"`);
    switch(action) {
      case "ACTION_HELP":
        break;
      case "ACTION_METEO":
        break;
      case "ACTION_SEARCHDATA":
        break;
      case "EMPTY_RESPONSE":
        this.message.channel.startTyping();
        await sleep(300);
        this.message.channel.stopTyping();
        break;
      default:
        this.Speak(botResponse);
        break;
    }
  }

  Speak(response) {
    MessageSender.setMessage(this.message).sendBack(response);
  }

  messageContainMention() {
    let usersMentions = this.message.mentions.users;
    let data = R.find(R.propEq('id', this.bot.user.id))(usersMentions);
    return data != undefined;
  }

}

module.exports = Brain;

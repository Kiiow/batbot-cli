
class MessageSender {

  constructor(message){
    this.message = message;
  }

  setMessage(message) {
    this.message = message;
  }

  sendBack(answer = "") {
    this.message.channel.send(answer);
  }

  getColorEmbed(colorName) {
    let color = colorName
    if(isNaN(colorName)){
      switch(colorName){
        case "success":
          color = 65280;
          break;
        case "error":
          color = 16711680;
          break;
        default:
          color = 4886754;
          break;
      }
    }
    return color;
  }

  sendEmbed(parameters, chan = undefined) {
    const EMBED_VALUES = {
      'color': this.getColorEmbed(parameters.color),
      'author': {
        'name': parameters.author_name || '',
        'icon_url': parameters.author_avatar || ''
      },
      'url': parameters.url || '',
      'description': parameters.description || '',
      'thumbnail': {
        'url': parameters.thumbnail || ''
      },
      'fields': parameters.fields || '',
      'footer': {
        'text': parameters.footer || ''
      }
    };

    let channelToSend;

    if (chan) {
      channelToSend = chan
    } else {
      channelToSend = this.message.channel
    }

    return channelToSend.send('', {'embed': EMBED_VALUES});
  }

  sendError(text, footer_infos, chan=undefined) {
    const PARAMS = {
      'color' : 16711680,
      'author_name' : this.message.member.displayName,
      'author_avatar' : this.message.author.avatarURL,
      'description' : text,
      'footer' : footer_infos || ''
    }
    return this.sendEmbed(PARAMS, chan);
  }

}

module.exports = MessageSender;

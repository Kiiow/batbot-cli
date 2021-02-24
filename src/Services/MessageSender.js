
class MessageSender {

  constructor(message){ this.message = message; }

  /**
   * Set le message
   * @param {Discord.message} message Instance du message
   */
  setMessage(message) {
    this.message = message;
    return this;
  }

  /**
   * Send back a message in discord
   * @param  {String} [answer=""]         Message to sendBack
   * @return {Promise}
   */
  sendBack(answer = "") {
    return this.message.channel.send(answer);
  }

  /**
   * Return the color that correspond to the message
   * @param  {String} colorName     Name of the color
   * @return {Integer}              Color
   */
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

  /**
   * Send an embed message in discord
   * @param  {JSON} parameters                   Different data to create the embed message
   * {
   * 'color': "Color of the embed default = 4886754",
   * 'author_name': "Name in the title of the embed",
   * 'author_avatar': "Icon in the title of the embed",
   * 'url': "",
   * 'description': "Description of the embed",
   * 'thumbnail': "Image at the top right of the embed",
   * 'fields': [{'name': "List of fields in the embed", 'value': ""}],
   * 'footer': "Data in the bottom of the embed",
   * }
   * @param  {Discord.channel} [chan=undefined]  (Optional) Channel discord where the message need to be sent
   * @return {Discord.message}                   New message instance
   */
  sendEmbed(parameters, chan = undefined) {
    let userNickname = this.message.member.nickname;
    let userAvatar = this.message.author.displayAvatarURL;
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
        'icon_url': userAvatar,
        'text': parameters.footer ? `${userNickname} • ${parameters.footer}` : userNickname
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

  /**
   * Send back an error message in discord
   * @param  {String} text                      Message to send
   * @param  {String} footer_infos              Data to put in the footer
   * @param  {Discord.channel} [chan=undefined] (Optional) Channel discord where the message ned to be sent
   * @return {Discord.message}                  Response instance
   */
  sendError(text, footer_infos, chan=undefined) {
    const PARAMS = {
      'color' : 16711680,
      'author_name' : this.message.author.username,
      'author_avatar' : this.message.author.avatarURL,
      'description' : text,
      'footer' : footer_infos || ''
    }
    return this.sendEmbed(PARAMS, chan);
  }

}

module.exports = MessageSender;

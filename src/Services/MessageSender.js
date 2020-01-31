
class MessageSender {

  constructor(message){ this.message = message; }

  /**
   * Set the message
   * @param {Discord.message} message message instance
   */
  setMessage(message) { this.message = message; }

  /**
   * Renvoie un message
   * @param  {String} [answer=""]         Message à renvoyer
   */
  sendBack(answer = "") {
    this.message.channel.send(answer);
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
   * @param  {Discord.channel} [chan=undefined]  (Optional) Channel discord where the message need to be sent
   * @return {Discord.message}                   New message instance
   */
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
      'author_name' : this.message.member.displayName,
      'author_avatar' : this.message.author.avatarURL,
      'description' : text,
      'footer' : footer_infos || ''
    }
    return this.sendEmbed(PARAMS, chan);
  }

}

module.exports = MessageSender;

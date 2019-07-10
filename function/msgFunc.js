
class msgFunc{

  /**
   * Envoie un message en RichEmbed
   * @param  {[Discord.message]} message [message de l'utilisateur]
   * @param  {[JSONObject]} val     [Object JSON avec toutes les données]
   * @structure {val} => color, author_name, author_avatar, description, footer, url
   */
  static sendEmbed(message, val){
    var value = {
      color : val.color,
      author_name : val.author_name,
      author_avatar : val.author_avatar,
      description : val.description,
      fields : val.fields,
      footer : val.footer,
      url : val.url
    };
    if(isNaN(val.color)){
      switch(val.color){
        case "success":
          value.color = 65280;
          break;
        case "error":
          value.color = 16711680;
          break;
        default:
          value.color = 4886754;
      }
    }
    for(var param in value){
      if(value[param] == undefined){
        value[param] = '';
      }
    }
    message.channel.send('', {
      embed: {
        color: value.color,
        author : { name : value.author_name, icon_url : value.author_avatar },
        url : value.url,
        description: value.description,
        fields : value.fields,
        footer : { text : value.footer }
      } });
  }

  /**
   * Envoie un message comming soon
   * @param  {[Discord.message]} message [message de l'utilisateur]
   * @param {[String]} footer [footer du message]
   */
  static sendCommingSoon(message, footer){
    this.sendEmbed(message, {
      color : 16711680,
      author_name : message.member.nickname,
      author_avatar : message.author.avatarURL,
      description : "**Comming soon**",
      footer : footer
    });
  }

  /**
   * Envoie un message d'erreur dans le chat
   * @param  {[Discord.message]} message [message de l'utilisateur]
   * @param  {[String]} txt     [message à envoyer]
   */
  static sendError(message, txt, footer){
    this.sendEmbed(message, {
      color : 16711680,
      author_name : message.member.displayName,
      author_avatar : message.author.avatarURL,
      description : txt,
      footer : footer
    });
  }

  /**
   * Renvoie le message avec la première lettre en capital
   * @param  {[String]} str [String à caps]
   * @return {[String]}     [String capsé]
   */
  static firstLetterCaps(str){
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
      return letter.toUpperCase();
    });
  }

}

module.exports = msgFunc;

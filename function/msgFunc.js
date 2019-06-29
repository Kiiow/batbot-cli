
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
    for(var param in value){
      if(value[param] == undefined){
        value[param] = '';
        if(param == "color"){
          value[param] = 4886754;
        }
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

}

module.exports = msgFunc;

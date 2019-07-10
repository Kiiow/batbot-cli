const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');

class Emoji{

  /**
   * Ajoute une émoji
   * Si l'utilisateur est admin
   * @param {[Discord.message]} message [Message de l'utilisateur]
   */
  static addEmoji(message){
    message.delete()
    /* */adminFunc.isAdmin(message.author.id, function(err, admin){
      if(admin){/* */
        let emojiName = message.content.split(' ')[1];
        let urlImg = message.content.split(' ')[2];
        if(emojiName == undefined || urlImg == undefined){
          msgFunc.sendError(message, "Vous devez renseigner un nom d'émoji et l'url d'une image `.emoji_addd <nom> <url_img>`" )
        }else{
          message.guild.createEmoji(urlImg, emojiName)
            .catch(console.error)
            .then(function(value){
              if(!value){
                msgFunc.sendError(message, "Erreur lors de l'ajout de l'émoji");
              }else{
                msgFunc.sendEmbed(message, {
                    color : "success",
                    author_name : message.member.nickname,
                    author_avatar : message.author.avatarURL,
                    description : "L'émoji `" + emojiName + "` à bien été ajoutée",
                });
              }
            });
        }
      /* */}else{
        msgFunc.sendError(message, "Vous devez être admin pour ajouter une nouvelle emoji");
      }
    });/* */
  }

  /**
   * Affiche la liste de toutes les émojis
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  static emojiList(message){
    message.delete();
    let emojis = message.guild.emojis.map(e=>e.toString()).join(" ");
    if(message.guild.emojis.array().length > 0){
      msgFunc.sendEmbed(message, {
        color : "infos",
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description : "Voici toutes les émoji disponibles sur le serveur : \n" + emojis
      });
    }else{
      msgFunc.sendError(message, "Il n'y a pas d'emoji supplémentaire sur ce serveur");
    }

    // msgFunc.sendCommingSoon(message);
  }
  
}
module.exports = Emoji;

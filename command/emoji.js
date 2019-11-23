const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');

class Emoji{

  /**
   * Exécute la commande demandée
   * @param {[Discord.message]} message [Message de l'utilisateur]
   * @param {[Logger]} logger [Logger winston]
   */
  static emojiCommand(message, logger){
    message.delete();
    let command = message.content.split(' ')[1];
    switch(command){
      case "add":
        logger.log(2, `[${this.name}] Start adding emoji`);
        this.addEmoji(message, logger);
        break;
      case "list":
        logger.log(2, `[${this.name}] Start looking for emojilist`);
        this.emojiList(message);
        break;
      default:
        logger.log(2, `[${this.name}] Display emoji help module`);
        this.emojiHelp(message);
    }
  }

  /**
   * Ajoute une émoji
   * Si l'utilisateur est admin
   * @param {[Discord.message]} message [Message de l'utilisateur]
   * @param {[Logger]} logger [Logger winston]
   */
  static addEmoji(message, logger){
    adminFunc.isAdmin(message.author.id, function(err, admin){
      if(admin){
        let emojiName = message.content.split(' ')[2];
        let urlImg = message.content.split(' ')[3];
        if(emojiName == undefined || urlImg == undefined){
          msgFunc.sendError(message, "Vous devez renseigner un nom d'émoji et l'url d'une image `.emoji addd <nom> <url_img>`" )
          logger.log(0, `[${this.name}] No emoji name given`);
        }else{
          message.guild.createEmoji(urlImg, emojiName)
            .catch(console.error)
            .then(function(value){
              if(!value){
                msgFunc.sendError(message, "Erreur lors de l'ajout de l'émoji");
                logger.log(0, `[${this.name}] Error while adding emoji`);
              }else{
                msgFunc.sendEmbed(message, {
                    color : "success",
                    author_name : message.member.nickname,
                    author_avatar : message.author.avatarURL,
                    description : "L'émoji `:" + emojiName + ":` à bien été ajoutée",
                });
                logger.log(3, `[${this.name}] Emoji successfully added`);
              }
            });
        }
      }else{
        msgFunc.sendError(message, "Vous devez être admin pour ajouter une nouvelle emoji");
        logger.log(1, `[${this.name}] Trying to add emoji without being admin`);
      }
    });
  }

  /**
   * Affiche la liste de toutes les émojis
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static emojiList(message){
    let emojis = message.guild.emojis.map( (e) => { e.toString(); }).join(" ");
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

  /**
   * Affiche l'aide sur les commandes d'emoji
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static emojiHelp(message){
    msgFunc.sendEmbed(message, {
      fields : [
        {
          name: "Commandes `.emoji` :",
          value: "\n**:smiley: `.emoji list`** -- " + "Affiche la liste des émojis disponibles sur le serveur" +
          "\n**:no_mouth: `.emoji add <nom> <url_img>`** -- " + "Ajoute une émoji sur le serveur"
        }
      ]
    })
  }

}
module.exports = Emoji;

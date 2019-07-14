const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');
const fs = require('fs');

class Config{

  /**
   * Vérifie quel configuration l'utilisateur souhaite changer
   * avec le 2ème paramètre de son message
   * et vérifié que l'utilisateur est admin
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static configCommand(message){
    message.delete();
    let thiss = this;
    adminFunc.isAdmin(message.author.id, (err, admin) => {
      if(admin){
        let configItem = (message.content.split(' ')[1]).toLowerCase();
        if(!message.guild.available){
          msgFunc.sendError(message, "Je n'ai pas les autorisation nécessaires pour ces fonctionnalités");
          return false;
        }
        switch(configItem){
          case "announce":
            thiss.confAnnounce(message);
            break;
          default:
            msgFunc.sendError(message, "donnée à configurer non trouvée");
            break;
        }
        return false;
      }else{
        msgFunc.sendError(message, "Vous devez être admin pour utiliser cette commande");
        return false;
      }
    });
    // msgFunc.sendCommingSoon(message);
  }

  /**
   * Change la configuration du channel d'annonce
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static confAnnounce(message){
    // console.log(message.guild.id);
    // console.log(message.guild.name);
    // console.log(message.content);
    let announceChan = message.content.split(' ')[2];
    if(announceChan == undefined || !announceChan.match(/<#[0-9]*>/i)){
      msgFunc.sendError(message, "Vous devez me spécifier un channel pour les annonces `.config announce <channel>`");
      return false;
    }
    adminFunc.getJSONData('data', (err, JSONObj) => {
      let i = 0, server;
      let found = false;
      while(i < JSONObj.servers.length && !found){
        server = JSONObj.servers[i];
        if(server.id == message.guild.id){
          found = true;
        }
        i++;
      }
      let announceId = parseInt(announceChan.replace(/<#|>/gi, ''));
      if(found){
        server.announce = announceId;
      }else{
        server = {
          name : message.guild.name,
          id : parseInt(message.guild.id),
          announce : announceId
        };
        JSONObj.servers.push(server);
      }
      fs.writeFile('./JSONFiles/data.json', JSON.stringify(JSONObj, null, '\t'), 'utf8', (err, data) => {
        if(err) console.error(err);
        else msgFunc.sendEmbed(message, {
          color : "success",
          author_name: message.member.displayName,
          author_avatar: message.author.avatarURL,
          description : "Le channel d'annonce est maintenant : " + announceChan
        });
      });
    });
  }


}
module.exports = Config;

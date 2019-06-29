const fs = require('fs');
const msgFunc = require('../function/msgFunc.js');

class Dictator{

  /**
   * kick l'utilisateur mentionné
   * si l'utilisateur qui utilise la commande est admin
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static kick(message){
    message.delete();
    var thiss =this;
    if(message.mentions.users.first() == undefined){
      var noMentionVal = {
        color : 16711680,
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description : ':x: Vous devez **mentionner** quelqu\'un pour cette commande \n `.kick <user>`'
      };
      msgFunc.sendEmbed(message, noMentionVal);
      return false;
    }
    fs.readFile('./JSONFiles/user.json', function (err, data) {
      // Si error return false
      if (err) return false;
      var JSONObj = JSON.parse(data);
      if(thiss.isAdmin(JSONObj, message.author.id)){
        message.guild.member(message.mentions.users.first()).kick();
        var kickVal = {
          color : 65280,
          author_name : message.mentions.users.first().username,
          author_avatar : 'https://cdn.discordapp.com/avatars/' + message.mentions.users.first().id + '/' + message.mentions.users.first().avatar + '.webp',
          description : 'L\'utilisateur '  + message.mentions.users.first().username + ' à bien été kick',
        };
        msgFunc.sendEmbed(message, kickVal);
      }else{
        var description = ':x: Vous n\'avez pas les autorisation nécessaires pour kick quelqu\'un.';
        var footer = '.kick @' + message.mentions.users.first().username;
        var val = {
          color : 16711680,
          author_name : message.member.nickname,
          author_avatar : message.author.avatarURL,
          description : description,
          footer : footer
        };
        msgFunc.sendEmbed(message, val);
      }
    });

  }

  /**
   * banni l'utilisateur mentionné
   * si l'utilisateur qui utilise la commande est admin
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static ban(message){
    message.delete();
    var thiss =this;
    if(message.mentions.users.first() == undefined){
      var noMentionVal = {
        color : 16711680,
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description : ':x: Vous devez **mentionner** quelqu\'un pour cette commande \n `.ban <user>`'
      };
      msgFunc.sendEmbed(message, noMentionVal);
      return false;
    }
    fs.readFile('./JSONFiles/user.json', function (err, data) {
      // Si error return false
      if (err) return false;
      var JSONObj = JSON.parse(data);
      if(thiss.isAdmin(JSONObj, message.author.id)){
        message.guild.member(message.mentions.users.first()).ban();
        var banVal = {
          color : 65280,
          author_name : message.mentions.users.first().username,
          author_avatar : 'https://cdn.discordapp.com/avatars/' + message.mentions.users.first().id + '/' + message.mentions.users.first().avatar + '.webp',
          description : 'L\'utilisateur '  + message.mentions.users.first().username + ' à bien été ban',
        };
        msgFunc.sendEmbed(message, banVal);
      }else{
        var description = ':x: Vous n\'avez pas les autorisation nécessaires pour ban quelqu\'un.';
        var footer = '.ban @' + message.mentions.users.first().username;
        var val = {
          color : 16711680,
          author_name : message.member.nickname,
          author_avatar : message.author.avatarURL,
          description : description,
          footer : footer
        };
        msgFunc.sendEmbed(message, val);
      }
    });
  }

  /**
   * envoie l'utilisateur en prison (rôle)
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static prison(message){
    message.delete();
    var val = {
      author_name : message.author.nickname,
      author_avatar : message.author.avatarURL,
      description : "Ca marche pas encore"
    }
    msgFunc.sendEmbed(message, val);
  }

  /**
   * Vérifie si l'utilisateur est admin
   * @param  {[JSONObject]}  JSONObj [Object JSON de user.JSON]
   * @param  {[Int]}  user_id [Id de l'utilisateur à vérifier]
   * @return {Boolean}         [true = admin sinon false]
   */
  static isAdmin(JSONObj, user_id){
    var admin;
    JSONObj.users.forEach(function(user){
      if(user.user_id == user_id){
        if(user.admin == 1){
          admin=true;
          return true;
        }else{
          admin=false;
          return false;
        }
      }
    });
    return admin;
  }

}
module.exports = Dictator;

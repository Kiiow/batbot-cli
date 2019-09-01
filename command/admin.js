const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');
const fs = require('fs');

/**
 * Classe qui rend les utilisateur administrateur sur le bot
 * @extends Command
 */
class Admin{

  /**
   * Exécute la commande demandée
   * @param {[Discord.message]} message [Message de l'utilisateur]
   */
  static adminCommand(message){
    message.delete();
    let command = message.content.split(' ')[1];
    switch(command){
      case "add":
        msgFunc.sendCommingSoon(message, message.content);
        // this.add_admin(message);
        break;
      case "list":
        this.list_admin(message);
        break;
      default:
        this.default_admin(message);
        break;
    }

  }

  /**
   * Affiche la liste des administrateur sur le bot
   * @param {[Discord.message]} message [Message de l'utilisateur]
   */
  static list_admin(message){
    adminFunc.getJSONData('user', (err, JSONObj) => {
      let i = 0;
      let userString, user, adminUsers = [];
      while(i < JSONObj.users.length){
        if(JSONObj.users[i].admin == 1){
          user = JSONObj.users[i];
          adminUsers.push( "\n- " + user.username + " (<@!" + user.user_id.toString() + ">)" );
        }
        i++;
      }
      userString = adminUsers.join("");
      msgFunc.sendEmbed(message, {
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description : "**__Les administrateur du bot sont :__**\n" + userString
      });
    });
  }

  static default_admin(message){
    msgFunc.sendEmbed(message, {
      fields: [
        {
          name: "Commandes `.admin` :",
          value: ":hammer_pick: **`.admin add <user>`** -- Ajoute un utilisateur en admin sur le Bot" +
            "\n :scroll: **`.admin list`** -- Affiche la liste des admins sur le Bot"
        }
      ]
    });
  }

  /**
   * Met la personne mentionner admin
   * @param {[Discord.message]} message [message envoyé]
   */
  static add_admin(message){
    let thiss = this;
    adminFunc.isAdmin(message.author.id, (err, admin) => {
      if(admin){
        let userObj = message.mentions.users.first();
        let user;
        if(userObj == undefined){
          msgFunc.sendError(message, "Vous devez mentionner quelqu'un à passer admin `.admin_add <user>`");
        }else{
          adminFunc.getJSONData('user', (err, JSONObj) => {
            JSONObj.users.map( userData => {
              if(userData.user_id == userObj.id){
                user = userData;
              }
            });
            if(user == undefined){
              // créé l'utilisateur
              let user = thiss.createUser(userObj, userObj.id);
              JSONObj.users.push(user);
            }
            user.admin = 1
            // console.log(JSONObj);
            fs.writeFile('./JSONFiles/user.json', JSON.stringify(JSONObj, null, '\t'), 'utf8', (err, data) => {
              if(err) console.error(err);
              else msgFunc.sendEmbed(message, {
                color : "success",
                author_name: message.member.displayName,
                author_avatar: message.author.avatarURL,
                description : "** **\nl'utilisateur <@!" + userObj.id + "> est maintenant admin"
              });
            });

          });
        }
      }else{
        msgFunc.sendError(message, "Vous devez être admin pour utiliser cette commande");
      }

    });

  }

  /**
   * Renvoi un nouvel utilisateur en objet JSON
   * @param  {[Discord.member]} member  [membre pour créer le nouvel utilisateur]
   * @param  {[Int]} user_id [Id de l'utilisateur à créer]
   * @return {[JSONObject]}         [Objet JSON du nouvel utilisateur]
   */
  static createUser(member, user_id){
    var newUser = {
      user_id : user_id,
      username : member.nickname,
      level : 1,
      xp : 0,
      last_message : { }
    };
    return newUser;
  }

}
module.exports = Admin;

const fs = require('fs');
const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');

class Dictator{

  /**
  * kick l'utilisateur mentionné
  * si l'utilisateur qui utilise la commande est admin
  * @param  {[Discord.message]} message [message de l'utilisateur]
  */
  static kick(message, logger){
    message.delete();
    if(message.mentions.users.first() == undefined){
      msgFunc.sendError(message,
        "Vous devez **mentionner** quelqu\'un pour cette commande \n `.kick <user> (motif)`"
      );
      logger.log(1, `[${this.name}] Trying to kick no one`)
      return false;
    }
    adminFunc.isAdmin(message.mentions.users.first().id, (err, admin) => {
      if(admin){
        // Mp à l'utilisateur comme quoi il à été kick
        (message.mentions.users.first()).createDM()
          .then((DMChannel) => {
            let reason = message.content.split(' ');
            reason.shift();
            reason.shift();
            reason = reason.join(' ');
            if(reason == "") reason = "pas de raison";


            message.guild.member(message.mentions.users.first()).kick()
              .then((userKicked) => {
                msgFunc.sendEmbed(DMChannel, {
                  color : "error",
                  author_name : message.member.displayName,
                  author_avatar : message.author.avatarURL,
                  description : "Vous avez été kick de "+ message.guild.name + "\n** **",
                  fields : [ {
                    name : "Par : ",
                    value : message.member.displayName,
                    inline : true
                  },
                  {
                    name : "Raison : ",
                    value : reason,
                    inline : true
                  }
                ]}, true);
                // Message dans le chan de kick pour confirmer
                msgFunc.sendEmbed(message, {
                  color : 65280,
                  author_name : message.mentions.users.first().username,
                  author_avatar : 'https://cdn.discordapp.com/avatars/' + message.mentions.users.first().id + '/' + message.mentions.users.first().avatar + '.webp',
                  description : 'L\'utilisateur '  + message.mentions.users.first().username + ' à bien été kick',
                });
                logger.log(3, `[${this.name}] Successfully kicked user`);
                if(userKicked == false) return false;
              })
              .catch( (err) => {
                logger.log(0, `[${this.name}] Error while kicking user`)
                msgFunc.sendError(message, "Erreur lors du kick de " + message.mentions.users.first().username);
                return false;
              });
          })
          .catch(console.err);
      }else{
        logger.log(1, `[${this.name}] Trying to kick user while not being admin`)
        msgFunc.sendError(message,
          "Vous n\'avez pas les autorisation nécessaires pour kick quelqu\'un.",
          '.kick @' + message.mentions.users.first().username
        );
      }
    });
  }

  /**
  * banni l'utilisateur mentionné
  * si l'utilisateur qui utilise la commande est admin
  * @param  {[Discord.message]} message [message de l'utilisateur]
  */
  static ban(message, logger){
    message.delete();
    if(message.mentions.users.first() == undefined){
      msgFunc.sendError(message,
        "Vous devez **mentionner** quelqu\'un pour cette commande \n `.ban <user> (motif)`"
      );
      logger.log(1, `[${this.name}] Trying to ban no one`)
      return false;
    }
    adminFunc.isAdmin(message.mentions.users.first().id, (err, admin) => {
      if(admin){
        // Mp à l'utilisateur comme quoi il à été kick
        (message.mentions.users.first()).createDM()
          .then((DMChannel) => {
            let reason = message.content.split(' ');
            reason.shift();
            reason.shift();
            reason = reason.join(' ');
            if(reason == "") reason = "pas de raison";

            message.guild.member(message.mentions.users.first()).ban()
              .then((userBanned) => {
                msgFunc.sendEmbed(DMChannel, {
                  color : "error",
                  author_name : message.member.displayName,
                  author_avatar : message.author.avatarURL,
                  description : "Vous avez été ban de "+ message.guild.name + "\n** **",
                  fields : [ {
                    name : "Par : ",
                    value : message.member.displayName,
                    inline : true
                  },
                  {
                    name : "Raison : ",
                    value : reason,
                    inline : true
                  }
                ]}, true);
                // Message dans le chan de kick pour confirmer
                msgFunc.sendEmbed(message, {
                  color : 65280,
                  author_name : message.mentions.users.first().username,
                  author_avatar : 'https://cdn.discordapp.com/avatars/' + message.mentions.users.first().id + '/' + message.mentions.users.first().avatar + '.webp',
                  description : 'L\'utilisateur '  + message.mentions.users.first().username + ' à bien été ban',
                });
                logger.log(3, `[${this.name}] Successfully kicked user`);
                if(userBanned == false) return false;
              })
              .catch( (err) => {
                logger.log(0, `[${this.name}] Error while banning user`);
                msgFunc.sendError(message, "Erreur lors du ban de " + message.mentions.users.first().username);
                return false;
              });
          })
          .catch(console.err);
      }else{
        logger.log(1, `[${this.name}] Trying to ban user while not being admin`)
        msgFunc.sendError(message,
          "Vous n\'avez pas les autorisation nécessaires pour ban quelqu\'un.",
          '.ban @' + message.mentions.users.first().username
        );
      }
    });
  }

  /**
  * envoie l'utilisateur en prison (rôle)
  * @param  {[Discord.message]} message [message de l'utilisateur]
  */
  static prison(message, logger){
    message.delete();
    adminFunc.isAdmin(message.author.id, (err, admin) => {
      if(admin){
        let user = message.mentions.members.first();
        if(user == undefined){
          msgFunc.sendError(message, "Vous devez mentionner quelqu'un à mettre en prison");
          logger.log(3, `[${this.name}] No user mentionned`);
          return false;
        }
        let prisonId;
        adminFunc.getJSONData('data', (err, JSONObj) => {
          JSONObj.servers.map( (server) => {
            if(server.id == message.guild.id) prisonId = server.roles.prison;
          });
          if(prisonId != undefined){
            let prison;
            message.guild.roles.map( (role) => {
              if(role.id == prisonId) prison = role;
            });
            user.addRole(prison);
            msgFunc.sendEmbed(message, {
              color: "success",
              author_name: user.displayName,
              author_avatar: user.avatarURL,
              description: user.displayName + " est désormais en prison !"
            });
            logger.log(3, `[${this.name}] Successfully placed user in prison`);
          }else {
            logger.log(1, `[${this.name}] No prison role defined in config`);
          }
        });
      }else{
        logger.log(1, `[${this.name}] Trying to place user in prison while not being admin`)
        msgFunc.sendError(message,
          "Vous n'êtes pas autorisé à envoyer quelqu'un en prison",
          ".kick @" + message.mentions.users.first().username);
      }
    });
  }


}
module.exports = Dictator;

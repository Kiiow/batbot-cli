const fs = require('fs');
const adminFunc = require('../function/adminFunc.js')
const msgFunc = require('../function/msgFunc.js');

class infos{

  /**
   * Retourne les informations de l'utilisateur qui a envoyé le message ou celui cité
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static getProfile(message){
    message.delete();
    adminFunc.getJSONData('user', function(err, data){
      if(message.mentions.users.first() == undefined){
        adminFunc.getUser(message.member.id, data, function(err, userData, found){
          if(!found) return false;
          msgFunc.sendEmbed(message, {
            color: message.member.colorRole.color,
            author_name: message.member.displayName,
            author_avatar: message.author.avatarURL,
            fields: [
              {
                "name": "Level",
                "value": userData.level,
                "inline": true
              },
              {
                "name": "XP",
                "value": userData.xp,
                "inline": true
              },
              {
                "name": "Status",
                "value": message.member.presence.status
              }
            ],
            footer : message.author.username + "#" + message.author.discriminator,
          });
        });
      }else{
        if(message.mentions.users.first().bot == true) return false;
        adminFunc.getUser(message.mentions.users.first().id, data, function(err, userData, found){
          msgFunc.sendEmbed(message, {
            author_name: message.mentions.users.first().username,
            author_avatar: message.mentions.users.first().avatarURL,
            fields: [
              {
                "name": "Level",
                "value": userData.level,
                "inline": true
              },
              {
                "name": "XP",
                "value": userData.xp,
                "inline": true
              },
              {
                "name": "Status",
                "value": message.mentions.users.first().presence.status
              } ],
            footer : message.mentions.users.first().username + "#" + message.mentions.users.first().discriminator,
          });
        });
      }
    });
  }

  /**
   * Affiche les informations sur toutes les commandes du bot
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static botCommandsInfos(message){
    message.delete();
    msgFunc.sendEmbed(message, {
      fields: [
        { name: "Liste des commandes générales :",
          value: "**:ping_pong: `.ping`** -- " + "Jouer au *~~PingPong~~* Tennis de table avec BatBot" +
          "\n**:book: `.wiki <recherche>`** -- " + "Renvoie le résultat trouvé sur wikipédia pour la recherche" +
          "\n**:clown: `.blague`** -- " + "Une petite blague de BatBot ?" +
          "\n**:video_game: `.profile <username>`** -- " + "Affiche le profile de la personne mentionnée" +
          "\n**:trophy: `.top`** -- " + "Affiche le top des utilisateurs" +
          "\n**:smiley: `.emojilist`** -- " + "Affiche la liste des émojis disponibles sur le serveur" +
          "\n**:pencil: `.help`** -- " + "Affiche la liste des commandes de BatBot"
        },
        { name: "** **\nCommandes de jeu :",
          value: "\n**:dragon: `.pokeinfo <nom_pkmn>`** -- " + "Affiche les infos d'un pokémon" +
          "\n**:dragon_face: `.pokestats <nom_pkmn>`** -- " + "Affiche les stats d'un pokémon"
        },
        { name : "** **\nAdmin commandes :",
          value : "\n**:octagonal_sign: `.stop`** -- " + "Arrête le bot" +
          "\n**:smiley: `.emoji_add <nom> <url_img>`** -- " + "Ajoute une émoji sur le serveur" +
          "\n**:hammer_pick: `.add_admin <username>`** -- " + "Ajoute le joueur mentionné en temps qu'admin pour le bot" +
          "\n**:door: `.kick <username>`** -- " + "Kick l'utilisateur mentionné" +
          "\n**:no_entry: `.ban <username>`** -- " + "Banni l'utilisateur mentionné" +
          "\n**:cop: `.prison <username>`** -- " + "Ajoute le rôle prison à l'utilisateur" +
          "\n**:wastebasket: `.clear <nbMessage>`** -- " + "Supprime des messages"
        }
      ]
    });
  }

  /**
   * Donne le top de tous les utilisateurs
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static top(message){
    message.delete();
    // msgFunc.sendCommingSoon(message, ".top");
    let users, thiss = this;
    adminFunc.getJSONData('user', function(err, JSONObj){
      users = JSONObj.users;
      users.sort(function(a, b){ return b.xp - a.xp});
      // console.log(users);
      let i = 0, value = "** **\n";
      let rankEmote = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:",
        ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
      while(i < 10 && i < users.length){
        value += rankEmote[i] + " -- **" + users[i].username + "** *[xp: " + users[i].xp + "]*\n";
        i++;
      }
      msgFunc.sendEmbed(message, {
        fields : [{
          name: ":trophy: Classement :",
          value: value
        }]
      });
    });
  }

}

module.exports = infos;

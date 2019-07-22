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
    let thiss = this;
    adminFunc.getJSONData('user', function(err, data){
      if(message.mentions.users.first() == undefined){
        adminFunc.getUser(message.member.id, data, function(err, userData, found){
          if(!found) return false;
          msgFunc.sendEmbed(message, thiss.getUserProfile(message, userData, "author"));
        });
      }else{
        if(message.mentions.users.first().bot == true) return false;
        adminFunc.getUser(message.mentions.users.first().id, data, function(err, userData, found){
          msgFunc.sendEmbed(message, thiss.getUserProfile(message, userData, "mentions"));
        });
      }
    });
  }

  /**
   * Retourne le JSON à envoyer pour le profil de l'utilisateur
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   * @param  {[JSONObject]} userData [Object JSON de l'utilisateur]
   * @param  {[String]} type     [type de profil à récup]
   * @return {[JSONObject]}          [Object JSON de l'embed à envoyer]
   */
  static getUserProfile(message, userData, type){
    let username, avatarURL, status, discriminator, color;

    switch(type){
      case "mentions":
        username = message.mentions.users.first().username;
        avatarURL = message.mentions.users.first().avatarURL;
        status = message.mentions.users.first().presence.status;
        discriminator = message.mentions.users.first().discriminator;
        break;
      case "author":
        color = message.member.colorRole.color;
        username = message.member.displayName;
        avatarURL = message.author.avatarURL;
        status = message.member.presence.status;
        discriminator = message.author.discriminator;
        break;
    }

    let profile = {
      author_name: username,
      author_avatar: avatarURL,
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
          "value": status
        } ],
      footer : username + "#" + discriminator,
    }
    return profile;
  }

  /**
   * Envoie le message d'help correspondant
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   */
  static helpCommand(message){
    message.delete();
    let command = message.content.split(' ')[1];
    let fields = [];
    switch(command){
      case "general":
        fields.push(this.getHelpGnrl());
        fields.push(this.getHelpGame());
        this.help(message, fields);
        break;
      case "admin":
        fields.push(this.getHelpAdmin());
        this.help(message, fields);
        break;
      case "all":
        fields.push(this.getHelpGnrl());
        fields.push(this.getHelpGame());
        fields.push(this.getHelpAdmin());
        this.help(message, fields);
        break;
      default:
        fields.push(this.getHelpDefault());
        this.help(message, fields);
        break;
    }
  }

  /**
   * Affiche les informations sur toutes les commandes du bot
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   * @param  {[Array]} fields [Tableau des différentes aides demandées]
   */
  static help(message, fields){
    msgFunc.sendEmbed(message, {
      fields: fields
    });
  }

  /**
   * Retourne l'aide général
   * @return {[String]} [aide général]
   */
  static getHelpGnrl(){
    let gnrlHelp = {
      name: "Commandes générale :",
      value: "**:ping_pong: `.ping`** -- " + "Jouer au *~~PingPong~~* Tennis de table avec BatBot" +
      "\n**:book: `.wiki <recherche>`** -- " + "Renvoie le résultat trouvé sur wikipédia pour la recherche" +
      "\n**:clown: `.blague`** -- " + "Une petite blague de BatBot ?" +
      "\n**:video_game: `.profile <username>`** -- " + "Affiche le profile de la personne mentionnée" +
      "\n**:trophy: `.top`** -- " + "Affiche le top des utilisateurs" +
      "\n**:smiley: `.emoji list`** -- " + "Affiche la liste des émojis disponibles sur le serveur" +
      "\n**:pencil: `.help`** -- " + "Affiche la liste des commandes de BatBot"
    };
    return gnrlHelp;
  }

  /**
   * Retourne l'aide de jeu
   * @return {[String]} [aide de jeu]
   */
  static getHelpGame(){
    let gameHelp = {
      name: "** **\nCommandes de jeu :",
      value: "\n**:dragon: `.pokeinfo <nom_pkmn>`** -- " + "Affiche les infos d'un pokémon" +
      "\n**:dragon_face: `.pokestats <nom_pkmn>`** -- " + "Affiche les stats d'un pokémon"
    };
    return gameHelp;
  }

  /**
   * Retourne l'aide admin
   * @return {[String]} [aide admin]
   */
  static getHelpAdmin(){
    let adminHelp = {
      name : "** **\nCommandes admin :",
      value : "\n**:octagonal_sign: `.stop`** -- " + "Arrête le bot" +
      "\n**:gear: `.config announce <channel>`** -- " + "Modifie le channel d'annonce du bot" +
      "\n**:loudspeaker: `.announce <msg>`** -- " + "Envoie un message dans le channel d'annonce" +
      "\n**:no_mouth: `.emoji add <nom> <url_img>`** -- " + "Ajoute une émoji sur le serveur" +
      "\n**:hammer_pick: `.admin add <username>`** -- " + "Ajoute le joueur mentionné en temps qu'admin pour le bot" +
      "\n**:door: `.kick <username>`** -- " + "Kick l'utilisateur mentionné" +
      "\n**:no_entry: `.ban <username>`** -- " + "Banni l'utilisateur mentionné" +
      "\n**:cop: `.prison <username>`** -- " + "Ajoute le rôle prison à l'utilisateur" +
      "\n**:wastebasket: `.clear <nbMessage>`** -- " + "Supprime des messages"
    };
    return adminHelp;
  }

  /**
   * Retourne l'aide par défault
   * @return {[String]} [aide de défault]
   */
  static getHelpDefault(){
    let defaultHelp = {
      name: "Commandes d'aides disponibles : ",
      value: "\n**:gear: `.help general`** -- " + "Donne l'aide sur les commandes général" +
      "\n**:tools: `.help admin`** -- " + "Donne l'aide sur les commandes admin" +
      "\n**:hammer_pick: `.help all`** -- " + "Donne l'aide sur toutes les commandes"
    }
    return defaultHelp;
  }

  /**
   * Donne le top de tous les utilisateurs / xp
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

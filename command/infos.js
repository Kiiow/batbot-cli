const adminFunc = require('../function/adminFunc.js')
const msgFunc = require('../function/msgFunc.js');
const user_service = require('./services/user_service.js');
const level_service = require('./services/level_service.js');

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
        user_service.getUserCallback(message.member.id, data, function(err, userData, found){
          if(!found){
            msgFunc.sendError(message, "Vous n'avez pas encore de profil, parlez plus !");
            return false;
          }
          msgFunc.sendEmbed(message, thiss.getUserProfile(message, userData, "author", data));
        });
      }else{
        if(message.mentions.users.first().bot == true){
          msgFunc.sendError(message, "l'utilisateur mentionné est un Bot");
          return false;
        }
        user_service.getUserCallback(message.mentions.users.first().id, data, function(err, userData, found){
          if(!found){
            msgFunc.sendError(message, "l'utilisateur mentionné n'a pas de profil");
            return false;
          }
          msgFunc.sendEmbed(message, thiss.getUserProfile(message, userData, "mentions", data));
        });
      }
    });
  }

  /**
   * Retourne le JSON à envoyer pour le profil de l'utilisateur
   * @param  {[Discord.message]} message [Message de l'utilisateur]
   * @param  {[JSONObject]} userData [Object JSON de l'utilisateur]
   * @param  {[String]} type     [type de profil à récup]
   * @param {[JSONObject]} data [Fichier JSON des utilisateurs]
   * @return {[JSONObject]}          [Object JSON de l'embed à envoyer]
   */
  static getUserProfile(message, userData, type, data){
    let nickname, avatarURL, status, discriminator, color, rank, roles = [];
    rank = user_service.getRank(data, userData.id, true);

    message.member.roles.forEach( (role) => {
      if(role.name != "@everyone") roles.push("<@&" + role.id + ">");
    });
    roles = roles.join(', ');
    switch(type){
      case "mentions":
        nickname = message.mentions.users.first().username;
        avatarURL = message.mentions.users.first().avatarURL;
        status = message.mentions.users.first().presence.status;
        discriminator = message.mentions.users.first().discriminator;
        break;
      case "author":
        color = message.member.colorRole.color;
        nickname = message.member.displayName;
        avatarURL = message.author.avatarURL;
        status = message.member.presence.status;
        discriminator = message.author.discriminator;
        break;
    }
    let profile = {
      author_name: nickname,
      author_avatar: avatarURL,
      fields: [
        {
          "name": "Level",
          "value": userData.level,
          "inline": true
        },
        {
          "name": "XP",
          "value": userData.xp + "/" + level_service.xpNeed(userData.level),
          "inline": true
        },
        {
          "name" : "Rôles",
          "value" : roles
        },
        {
          "name": "Status",
          "value": status,
          "inline" : true
        },
        {
          "name" : "Rank",
          "value" : rank,
          "inline" : true
        }
         ],
      footer : userData.username + "#" + discriminator,
    }
    return profile;
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
        let username;
      while(i < 10 && i < users.length){
        value += rankEmote[i] + " -- **" + users[i].nickname + "** *[xp: " + users[i].xp + "]*\n";
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
      case "gnrl":
      case "général":
      case "g":
        this.getHelp("general", message);
        break;
      case "admin":
        this.getHelp("admin", message);
        break;
      case "all":
        this.getHelp(undefined, message);
        break;
      case "game":
        this.getHelp("game", message);
        break;
      default:
        this.getHelpDefault(message);
        break;
    }
  }

  static getHelp(category, message){
    let thiss = this;
    adminFunc.getJSONData('commands', (err, JSONObj) =>{
      let commandGnrArray = [];
      let commandGameArray = [];
      let commandAdminArray = [];
      JSONObj.Commands.sort(function(a, b){
        return ((a.name == b.name) ? 0 : ((a.name > b.name) ? 1 : -1 ));
      });
      JSONObj.Commands.forEach(function(command){
        let data = command.help_data;
        if(!command.active_command) return false;
        switch(data.category){
          case "general":
            commandGnrArray.push("**:" + data.icon + ": `" + data.command + "`** -- " + data.text);
            break;
          case "admin":
            commandAdminArray.push("**:" + data.icon + ": `" + data.command + "`** -- " + data.text);
            break;
          case "game":
            commandGameArray.push("**:" + data.icon + ": `" + data.command + "`** -- " + data.text);
            break;
        }
      });
      let commandGnr = commandGnrArray.join('\n');
      let commandAdmin = commandAdminArray.join('\n');
      let commandGame = commandGameArray.join('\n');
      let fields = [];
      switch(category){
        case "general":
          fields.push({ name : "Commandes général", value : commandGnr });
          break;
        case "admin":
          fields.push({ name : "Commandes de jeu", value : commandGame });
          break;
        case "game":
          fields.push({ name : "Commandes admin", value : commandAdmin });
          break;
        default:
          fields.push({ name : "Commandes général", value : commandGnr + "\n** **" });
          fields.push({ name : "Commandes de jeu", value : commandGame + "\n** **" });
          fields.push({ name : "Commandes admin", value : commandAdmin });
          break;
      }
      thiss.help(message, fields);
    });
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
   * Retourne l'aide par défault
   * @return {[String]} [aide de défault]
   */
  static getHelpDefault(message){
    let defaultHelp = {
      name: "Commandes `.help` : ",
      value: "\n**:gear: `.help general`** -- Donne l'aide sur les commandes général" +
      "\n**:tools: `.help admin`** -- Donne l'aide sur les commandes admin" +
      "\n**:video_game: `.help game`** -- Donne l'aide sur les commandes de jeu" +
      "\n**:hammer_pick: `.help all`** -- Donne l'aide sur toutes les commandes"
    }
    this.help(message, [defaultHelp]);
  }



}

module.exports = infos;

const fs = require('fs');

/**
* Classe qui s'occupe du leveling des utilisateurs
* @extends Command
*/
class Level{
  /**
  * Action principal de la classe
  * Si l'utilisateur n'est pas le Bot
  * et le message >= 15 caractères
  * alors gagne de l'xp (+/- 15% de la taille du msg)
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @return {[Boolean]}         [False si error ou utilisateur = BatBot]
  */
  static action(message){
    // Si l'utilisateur est le bot return false
    if(message.author.bot) return false;
    // Bug : this = undefined une fois dans une function anonyme
    var thiss = this;
    // Lecture du fichier JSON
    fs.readFile('./JSONFiles/user.json', function (err, data) {
      // Si error return false
      if (err) return false;
      var obj = JSON.parse(data);
      var user, levelUp;
      // Si l'utilisateur existe récupère l'objectJSON pour le traiter
      if(thiss.userExist(obj, message)){
        user = thiss.getUser(obj, message);
        // Anti spam pour gagner de l'xp. les messages fonctionne toutes les 40 sec
        if(message.createdTimestamp <= user.last_message.timestamp + 20000) return false;
        levelUp = thiss.addXp(user, message);
        thiss.changeLastMessage(user, message);
      }else{ // Sinon créé un utilisateur
        obj.users.push(thiss.createUser(message));
        user = thiss.getUser(obj, message);
        levelUp = thiss.addXp(user, message);
        thiss.changeLastMessage(user, message);
      }
      // Commit les modifications
      fs.writeFile('./JSONFiles/user.json', JSON.stringify(obj, null, '\t'), 'utf8', function(err, data){
        if(err) console.error(err);
      });
      // Envoie un message si levelUp
      // Et ajoute les rôles correspondant
      if(levelUp){
        thiss.levelUp(message, user.level);
        thiss.addRank(message, user.level);
      }
    });
  }

  /**
  * Change le dernier message envoyé par la personne
  * @param  {[JSONObject]} user    [Utilisateur au format JSON]
  * @param  {[Discord.message]} message [message traité]
  */
  static changeLastMessage(user, message){
    user.last_message.content = message.content;
    user.last_message.timestamp = message.createdTimestamp;
  }

  /**
  * Calcule l'xp nécessaire pour le prochain niveau
  * @param  {[Int]} level [level du joueur]
  * @return {[Int]}       [Xp pour le prochain niveau]
  */
  static xpNeed(level){
    let xp = 4*(Math.pow(level, 5))-15*(Math.pow(level, 2))+100*level;
    return Math.round(xp);
  }

  /**
  * Calcule l'xp reçue en fonction de la taille du message
  * + ou - 15%
  * @param  {[Int]} length [taille du message en NbCaractère]
  * @return {[Int]}        [nombre d'xp gagné]
  */
  static calcXp(length){
    let minXp = Math.round(length*0.85);
    let maxXp = Math.round(length*1.15);
    return Math.round(Math.random() * (maxXp - minXp) + minXp);
  }

  /**
  * Retourne si l'utilisateur existe ou non
  * @param  {[JSONObject]} JSONObj [Object JSON du fichier levels.JSON]
  * @param  {[String]} message [message qui est traité]
  * @return {[boolean]}         [True si l'utilisateur existe false sinon]
  */
  static userExist(JSONObj, message){
    let exist = false;
    JSONObj.users.forEach(function(user){
      if(user.user_id == message.author.id){
        exist = true;
      }
    });
    return exist;
  }

  /**
  * Ajoute l'xp au fichier JSON
  * Augmente le niveau dans le JSON si nécessaire
  * @param {[JSONObject]} JSONObj [Object JSON de l'utilisateur]
  * @param {[Discord.message]} message [message envoyé par l'utilisateur]
  * @return {[Boolean]} [true si l'utilisateur est monté de niveau sinon false]
  */
  static addXp(JSONObj, message){
    var xp = this.calcXp(message.content.length);
    var levelUp;
    JSONObj.xp += xp;
    while(JSONObj.xp > this.xpNeed(JSONObj.level)){
      JSONObj.level ++;
      levelUp = true;
    }
    return levelUp;
  }

  /**
  * Créé un nouvel utilisateur au format JSON
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @return {[JSONObject]}         [Object JSON de l'utilisateur]
  */
  static createUser(message){
    var newUser = {
      user_id : message.author.id,
      username : message.member.displayName,
      level : 1,
      xp : 0,
      last_message : {
        content : message.content,
        timestamp : message.createdTimestamp
      }
    };
    return newUser;
  }

  /**
  * Récupère l'objet JSON de l'utilisateur qui a envoyé le message
  * dans un tableau d'objet
  * @param  {[JSONObject]} JSONObj [Tous les utilisateurs]
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @return {[JSONObject]}         [Object JSON de l'utilisateur]
  */
  static getUser(JSONObj, message){
    var myUser;
    JSONObj.users.forEach(function(user){
      if(user.user_id == message.author.id){
        myUser = user;
        user.username = message.member.displayName;
      }
    });
    return myUser;
  }

  /**
  * Envoie un message embed dans le channel si l'utilisateur à levelUp
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @param  {[Int]} level   [nouveau niveau de l'utilisateur]
  */
  static levelUp(message, level){

    message.channel.send('', {
      embed: {
        color: 3376639,
        author : {
          name : message.member.displayName,
          icon_url : message.author.avatarURL
        },
        description: 'Bravo vous êtes désormais niveau ' + level,
        footer : { }
      }
    });
  }

  /**
   * Ajoute les ranks correspondant au niveau du message
   * Peut en ajouter plusieurs si nécessaire
   * @param {[Discord.message]} message [message de l'utilisateur]
   * @param {[Int]} level   [level de l'utilisateur]
   */
  static addRank(message, level){
    fs.readFile('./JSONFiles/data.json', function (err, data) {
      if (err) return false;
      var JSONObj = JSON.parse(data);
      JSONObj.rank_level.forEach(function(rank){
        if(rank.level <= level){
          message.member.addRole(rank.id, 'levelUp');
        }else return false;
      });
    });
  }

}
module.exports = Level;

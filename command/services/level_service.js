const globalFunc = require('../../function/globalFunc.js');
const msgFunc = require('../../function/msgFunc.js');

class level_service {

  /**
  * Ajoute l'xp au fichier JSON
  * Augmente le niveau dans le JSON si nécessaire
  * @param {[JSONObject]} JSONObj [Object JSON de l'utilisateur]
  * @param {[Discord.message]} message [message envoyé par l'utilisateur]
  * @return {[Boolean]} [true si l'utilisateur est monté de niveau sinon false]
  */
  static addXp(JSONObj, message){
    var xp = this.calcXp(message.content.length);
    console.log( globalFunc.getDate("hh:mm:ss-dd/MM/YYYY") + " -- [xp:" + xp + "] " + JSONObj.nickname);
    var levelUp = false;
    JSONObj.xp += xp;
    while(JSONObj.xp > this.xpNeed(JSONObj.level)){
      JSONObj.level ++;
      levelUp = true;
    }
    return levelUp;
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
  * Calcule l'xp nécessaire pour passer le niveau
  * @param  {[Int]} level [level du joueur]
  * @return {[Int]}       [Xp pour le prochain niveau]
  */
  static xpNeed(level){
    // (4*LVL^5)-(15*LVL^2)+(100*LVL)
    let xp = 4*(Math.pow(level, 5))-15*(Math.pow(level, 2))+100*level;
    xp = Math.round(xp/100)*100;
    return Math.round(xp);
  }

  /**
  * Envoie un message embed dans le channel si l'utilisateur à levelUp
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @param  {[Int]} level   [nouveau niveau de l'utilisateur]
  */
  static levelUp(message, level){
    msgFunc.sendEmbed(message, {
      color: 3376639,
      author_name : message.member.displayName,
      author_avatar : message.author.avatarURL,
      description: 'Bravo vous êtes désormais niveau ' + level
    });
  }

}

module.exports = level_service;

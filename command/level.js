const adminFunc = require('../function/adminFunc.js');
const user_service = require('./services/user_service.js');
const level_service = require('./services/level_service.js');

/**
* Classe qui s'occupe du leveling des utilisateurs
* @extends Command
*/
class Level{

  /**
  * Calcul et ajoute l'xp que l'utilisateur à gagné
  * Créer l'utilisateur si nécessaire
  * @param  {[Discord.message]} message [Message de l'utilisateur]
  * @return {[Boolean]}         [False si error ou utilisateur = BatBot]
  */
  static action(message, logger){
    if(message.author.bot) return false;
    // Lecture du fichier JSON
    adminFunc.getJSONData('user', (err, JSONObj) => {
      var user, levelUp;

      if(!user_service.userExist(JSONObj, message)){
        let newUser = user_service.createUserByMember(message.member);
        logger.log(2, `[${this.name}] Create user ${newUser.username + '#' + newUser.discriminator}`)
        JSONObj.users.push(newUser);
      }

      user = user_service.getUser(JSONObj, message);
      if(message.createdTimestamp <= user.last_message.timestamp + 20000) return false;
      levelUp = level_service.addXp(user, message);
      this.majData(user, message);

      adminFunc.writeJSONData('user', JSONObj);

      if(levelUp){
        level_service.levelUp(message, user.level);
        logger.log(2, `[${this.name}] User ${user.username + '#' + user.discriminator} leveled up`)
        // this.addRank(message, user.level);
      }
    });
  }

  /**
   * Mets à jour les données dans le JSON
   * @param  {[JSONObject]} user    [Object JSON de l'utilisateur]
   * @param  {[Discord.message]} message [message de l'utilisateur]
   */
  static majData(user, message){
    let member = message.member
    user.nickname = member.displayName;
    user.username = member.user.username;
    user.discriminator = member.user.discriminator;
    user.last_message.content = message.content;
    user.last_message.timestamp = message.createdTimestamp;
  }

  /**
   * Ajoute les ranks correspondant au niveau du message
   * Peut en ajouter plusieurs si nécessaire
   * @param {[Discord.message]} message [message de l'utilisateur]
   * @param {[Int]} level   [level de l'utilisateur]
   */
  static addRank(message, level){
    adminFunc.getJSONData('data', (err, JSONObj) => {
      JSONObj.rank_level.forEach(function(rank){
        if(rank.level <= level){
          message.member.addRole(rank.id, 'levelUp');
        }else return false;
      });
    });
  }

}
module.exports = Level;

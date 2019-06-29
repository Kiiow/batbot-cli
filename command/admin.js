const fs = require('fs');

/**
 * Classe qui rend les utilisateur administrateur sur le bot
 * @extends Command
 */
class Admin{

  /**
   * Met la personne mentionner admin
   * @param {[Discord.message]} message [message envoyé]
   */
  static add_admin(message){
    // Format de l'id d'un utilisateur
    let rules = /<@![0-p]*>/;
    var user_id = message.content.substr(11, message.content.length);

    // Si le texte spécifiée après '.add_admin' est un utilisateur ...
    if(rules.test(user_id)){
      user_id = user_id.replace(/<|@|!|>/gi, "");
      var thiss=this;
      fs.readFile('./JSONFiles/user.json', function (err, data) {
        if (err) throw err;
        var JSONObj = JSON.parse(data);
        // Si l'auteur est admin
        if(thiss.isAdmin(JSONObj, message.author.id)){
          // Si l'utilisateur n'existe pas
          if(!thiss.alreadyExist(JSONObj, user_id)){
            var member;
            message.mentions.users.forEach(function(user){
              member = user.lastMessage.member;
            });
            JSONObj.users.push(thiss.createUser(JSONObj, member, user_id));
          }
          thiss.setAdmin(JSONObj, user_id);
          fs.writeFile('./JSONFiles/user.json', JSON.stringify(JSONObj, null, '\t'), 'utf8');
        }else{
          console.log("--auteur non admin");
        }
      });
    }

  }

  /**
   * Créé un nouvel Object JSON d'utilisateur
   * @param  {[JSONObject]} JSONObj [Object JSON de user.JSON]
   * @param  {[Discord.member]} member  [membre pour créer le nouvel utilisateur]
   * @param  {[Int]} user_id [Id de l'utilisateur à créer]
   * @return {[JSONObject]}         [Object JSON du nouvel utilisateur]
   */
  static createUser(JSONObj, member, user_id){
    var newUser = {
      user_id : user_id,
      username : member.nickname,
      level : 1,
      xp : 0,
      last_message : { }
    };
    return newUser;
  }

  /**
   * Vérifie qu'un utilisateur existe ou non dans le fichier JSON
   * @param  {[JSONObject]} JSONObj [Fichier JSON user.JSON]
   * @param  {[Int]} user_id [Id de l'utilisateur traité]
   * @return {[Boolean]}         [true = existe sinon false]
   */
  static alreadyExist(JSONObj, user_id){
    var exist = false;
    JSONObj.users.forEach(function(user){
      if(user.user_id == user_id){
        exist = true;
      }
    });
    return exist;
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
  /**
   * Met l'utilisateur admin dans l'objectJSON
   * @param {[JSONObject]} JSONObj [ObjectJSON de user.JSON]
   * @param {[Int]} user_id [id de l'utilisateur à mettre admin]
   */
  static setAdmin(JSONObj, user_id){
    JSONObj.users.forEach(function(user){
      if(user.user_id == user_id){
        user.admin = 1;
      }
    });
  }

}
module.exports = Admin;

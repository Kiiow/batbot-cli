
class user_service{

  /**
  * Retourne si l'utilisateur existe ou non
  * @param  {[JSONObject]} JSONObj [Object JSON du fichier levels.JSON]
  * @param  {[String]} message [message qui est traité]
  * @return {[boolean]}         [True si l'utilisateur existe false sinon]
  */
  static userExist(JSONObj, message){
    let exist = false;
    JSONObj.users.forEach(function(user){
      if(user.id == message.author.id){
        exist = true;
      }
    });
    return exist;
  }

  /**
  * Récupère l'objet JSON de l'utilisateur qui a envoyé le message
  * dans un tableau d'objet
  * @param  {[JSONObject]} JSONObj [Tous les utilisateurs]
  * @param  {[Discord.message]} message [message de l'utilisateur]
  * @return {[JSONObject]}         [Object JSON de l'utilisateur]
  */
  static getUser(JSONObj, message, param){
    let userId;
    switch (param) {
      case "user":
        userId = message.id;
        break;
      default:
        userId = message.author.id;
    }
    var myUser;
    JSONObj.users.forEach(function(user){
      if(user.id == userId){
        myUser = user;
      }
    });
    return myUser;
  }

  /**
   * Retourne l'utilisateur avec l'id donné
   * @param  {[Int]}   user_id  [id de l'utilisateur]
   * @param  {[Array]}   JSONArr  [Liste des utilisateurs]
   * @param  {Function} callback [Callback Function]
   */
  static getUserCallback(user_id, JSONArr, callback){
    var userData;
    var found = true;
    JSONArr.users.forEach(function(user){
      if(user.id == user_id){
        userData = user;
        return true;
      }
    });
    if(userData == undefined) found = false;
    callback(null, userData, found);
  }


  /**
  * Retourne le rank de l'utilisateur
  * @param  {[JSONObject]} JSONObj [liste des utilisateurs]
  * @param  {[Integer]} user_id [id de l'utilisateur]
  * @param  {[Boolean]} emoji   [true = emoji(jusqu'a 10), false = Int]
  * @return {[Integer | String]}         [description]
  */
  static getRank(JSONObj, user_id, emoji){
    let userRank, i = 0, found = false;

    let users = JSONObj.users;
    users.sort(function(a, b){ return b.xp - a.xp});
    let rankEmote = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:",
    ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
    while(i < users.length && !found){
      if(user_id == users[i].id){
        found = true;
        if(emoji && i < 10) userRank = rankEmote[i];
        else userRank = i + 1;
        found = true;
      }
      i++;
    }
    return userRank;
  }

  /**
  * Créé un nouvel utilisateur au format JSON
  * @param  {[Discord.member]} member [message de l'utilisateur]
  * @return {[JSONObject]}         [Object JSON de l'utilisateur]
  */
  static createUserByMember(member){
    var newUser = {
      id : member.id,
      nickname : member.displayName,
      username : member.user.username,
      discriminator : member.user.discriminator,
      level : 1,
      xp : 0,
      last_message : {
        content : "",
        timestamp : 0
      }
    };
    return newUser;
  }

}

module.exports = user_service;

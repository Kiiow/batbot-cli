const fs = require('fs');
const request = require('request');

class adminFunc {
  /**
   * Vérifie si l'utilisateur est admin sur le bot
   * @param  {[Int]}  user_id [Id de l'utilisateur à vérifier]
   * @param {[callback]} callback [function de callback]
   */
  static isAdmin(user_id, callback){
    this.getJSONData('user', function (err, JSONObj) {
        // console.log(JSONObj);
        // console.log(user_id);
        var admin = true;
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
        callback(null, admin);
    });
  }

  /**
   * Récupère le fichier JSON demandé
   * @param  {[String]}   JSONFileName [Fichier à lire]
   * @param  {Function} callback     [Callback Function]
   */
  static getJSONData(JSONFileName, callback){
    fs.readFile('./JSONFiles/' + JSONFileName + '.json', function (err, content) {
        if (err) return callback(err);
        var JSONObj = JSON.parse(content);
        callback(null, JSONObj);
    });
  }

  /**
   * Exécute une requête AJAX en POST sur l'url donné
   * @param  {[String]}   url      [url de la page]
   * @param  {Function} callback [Callback Function]
   */
  static ajaxRequest(url, callback){
    request.post(url, {json: true}, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        callback(null, body);
      }
    });
  }

  /**
   * Retourne l'utilisateur avec l'id donné
   * @param  {[Int]}   user_id  [id de l'utilisateur]
   * @param  {[JSONObject]}   JSONObj  [Object JSON des utilisateurs]
   * @param  {Function} callback [Callback Function]
   */
  static getUser(user_id, JSONObj, callback){
    var userData;
    var found = true;
    JSONObj.users.forEach(function(user){
      if(user.user_id == user_id){
        userData = user;
        return true;
      }
    });
    if(userData == undefined) found = false;
    callback(null, userData, found);
  }

}

module.exports = adminFunc;

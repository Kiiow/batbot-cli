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
          if(user.id == user_id){
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
   * @param  {[String]}   JSONFileName [Fichier à lire (ex: 'user')]
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
   * Ecrit les modifications du fichier JSON
   * @param  {[String]} JSONFileName [fichier JSON à modifier]
   * @param  {[JSONObj]} JSONObj      [nouveau contenu du fichier JSON]
   * @param {Function} callback [Callback Function]
   */
  static writeJSONData(JSONFileName, JSONObj, callback){
    fs.writeFile('./JSONFiles/' + JSONFileName + '.json', JSON.stringify(JSONObj, null, '\t'), 'utf8', function(err, data){
      if(err) console.error(err);
      else if(callback != undefined) callback(null);
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
   * Supprimme tous les items avec la valeur fournie present dans le tableau
   * @param  {[Array]} arr         [Tableau à traiter]
   * @param  {[Array.Object]} searchValue [Item à supprimmer (String, object, ...)]
   * @return {[Array]}             [Tableau traité]
   */
  static removeItemByString(arr, searchValue){
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

}

module.exports = adminFunc;

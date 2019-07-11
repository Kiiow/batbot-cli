const fs = require('fs');

class globalFunc{

  /**
   * Ajoute les logs dans le fichier correspondant
   * @param  {[Discord.message]} message [message de l'utilisateur]
   * @param  {[String]} func [function exécutée]
   */
  static addLogs(message, func){
    let date = this.getDate("YYYY-MM-dd|hh:mm:ss");
    let log = "[" + date + "] [" + func + "/" + message.member.displayName + "]: " + message.content + "\r\n";
    fs.appendFile('./log.txt', log, (err) => {if(err) console.error(err);});
  }

  /**
   * Retourne la date actuel en fonction du format donné
   * @param  {[String]} format [format de la date à retourner]
   * @param  {[Date]} date [date à transformer (optionnel)]
   * @return {[String]}        [date formattée]
   */
  static getDate(format, date){
    if(date == undefined) date = new Date();
    let month = date.getUTCMonth()+1;
    if((month.toString()).length == 1) month = "0" + month.toString();

    var mapObj = {
      "YYYY": date.getUTCFullYear(),
      "MM": month,
      "dd": date.getUTCDate(),
      "hh": date.getUTCHours(),
      "mm": date.getUTCMinutes(),
      "ss": date.getUTCSeconds()
    };
    var regex = new RegExp(Object.keys(mapObj).join("|"),"gi");
    let dateReturn = format.replace(regex, function(matched){
      return mapObj[matched];
    });
    return dateReturn;
  }


}

module.exports = globalFunc;

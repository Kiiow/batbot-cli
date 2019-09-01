const fs = require('fs');

class globalFunc{

  /**
   * Retourne la date actuel en fonction du format donné
   * @param  {[String]} format [format de la date à retourner]
   * @param  {[Date]} date [date à transformer (optionnel)]
   * @return {[String]}        [date formattée]
   */
  static getDate(format, date){
    if(date == undefined){
      date = new Date();
      date.setTime(date.getTime() + 7200000);
    }
    let month = date.getUTCMonth()+1;
    let day = date.getUTCDate();
    let hour = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let second = date.getUTCSeconds();
    if((second.toString()).length == 1) second = "0" + second.toString();
    if((minutes.toString()).length == 1) minutes = "0" + minutes.toString();
    if((hour.toString()).length == 1) hour = "0" + hour.toString();
    if((month.toString()).length == 1) month = "0" + month.toString();
    if((day.toString()).length == 1) day = "0" + day.toString();
    var mapObj = {
      "YYYY": date.getUTCFullYear(),
      "MM": month,
      "dd": day,
      "hh": hour,
      "mm": minutes,
      "ss": second
    };
    let dateReturn = this.replaceString(format, [], [], mapObj);
    return dateReturn;
  }

  /**
   * Remplace des caractères (search) par d'autres (replace) dans un String
   * @param  {[String]} string  [String avec les éléments à remplacer]
   * @param  {[Array]} search  [Valeurs à remplacer]
   * @param  {[Array]} replace [Valeurs de remplacement]
   * @return {[String | Boolean]}         [String avec les éléments remplacés, False si erreur]
   */
  static replaceString(string, search, replace, mapObj){
    if(search.length != replace.length) return false;
    if(mapObj == undefined){
      let i = 0;
      let mapObj = {};
      while(i < search.length){
        mapObj[search[i]] = replace[i];
        i++;
      }
    }
    let regex = new RegExp(Object.keys(mapObj).join("|"),"gi");
    string = string.replace(regex, (matched) => {
      return mapObj[matched];
    });
    return string;
  }


}

module.exports = globalFunc;

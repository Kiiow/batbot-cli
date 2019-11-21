const fs = require('fs');
const winston = require('winston');


class globalFunc{

  /**
   * Constructeur de globalFunc
   * Initialise le logger winston et tous ses paramètres
   */
  constructor(){
    let options = {
      transport : {
        file: {
          level: 'debug',
          filename: './logs/' + globalFunc.getDate("YYYY-MM-dd")  + '.log',
          handleExceptions: true,
          json: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          colorize: false,
        },
        console: {
          level: 'debug',
          handleExceptions: true,
          json: false,
          format : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf( (info) =>{
              return `${info.date} [${info.level}] | ${info.app.name}(${info.app.version}) | ${info.message}`
            })
          ),
          colorize: true,
        }
      },
      customLevels : {
        levels:{
          fatal: -1,
          error: 0,
          warn: 1,
          info: 2,
          success: 3,
          debug: 4
        },
        colors: {
          fatal: 'red',
          error: 'red',
          warn: 'yellow',
          info: 'blue',
          success: 'green',
          debug: 'magenta'
        }
      }
    };

    this.logger = winston.createLogger({
      levels: options.customLevels.levels,
      colorize: true,
      format: winston.format.json(),
      transports: [
        new winston.transports.File( options.transport.file ),
        new winston.transports.Console( options.transport.console )
      ]
    });
    winston.addColors(options.customLevels.colors);
  }
  /**
   * Envoie un message de log dans la console et sauvegarde le message dans un fichier de log
   * @param  {int} level   [niveau du log]
   * @param  {String} message [message du log]
   */
  log(level, message){
    let lvl_text = "info";
    switch(level){
      case -1:
        lvl_text = "fatal"
        break;
      case 0:
        lvl_text = "error";
        break;
      case 1:
        lvl_text = "warn";
        break;
      case 2:
        lvl_text = "info";
        break;
      case 3:
        lvl_text = "success";
        break;
      case 4:
        lvl_text = "debug";
        break;
    }
    try{
      this.logger.log({
        date : globalFunc.getDate("YYYY-MM-dd hh:mm:ss"),
        app : {
                name :'BatBot.js',
                version: '2.0.1'
              },
        level : lvl_text,
        message : message,
        timestamp : Math.round(Date.now()/1000)
      });
    }catch(err){
      console.error(err)
    }
  }

  /**
   * Retourne la date actuel en fonction du format donné
   * @param  {[String]} format [format de la date à retourner]
   * @param  {[Date]} date [date à transformer (optionnel)]
   * @return {[String]}        [date formattée]
   */
  static getDate(format, date){
    if(date == undefined){
      date = new Date();
      date.setTime(date.getTime() + 3600000);
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

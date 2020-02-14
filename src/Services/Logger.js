const Winston = require('Winston');
const R = require('ramda');

const CONFIG = require('../Config');

/**
 * Class Logger
 */
class Logger {

  /**
   * Constructor of logger
   * @param {String} loggerName Name of the logger
   */
  constructor(loggerName) {
    this.context = [];
    this.contextAdd('loggerName', loggerName)
    const OPTIONS = {
      transport : {
        file: {
          level: CONFIG.LOGGER.FILE.LEVEL,
          filename: CONFIG.LOGS_PATH,
          handleExceptions: true,
          json: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          colorize: false,
        },
        console: {
          level: CONFIG.LOGGER.CONSOLE.LEVEL,
          handleExceptions: true,
          json: false,
          format : Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.printf( (info) => {
              let app = info.app || {}
              let spacing = ' '.repeat(7 - parseInt(info.level.toString().length-10));
              return `[${info.level}]${spacing}| ${app.name}(${app.version}) | ${info.message}`
            })
          ),
          colorize: true,
        }
      },
      customLevels : {
        levels: {
          FATAL: -1,
          ERROR: 0,
          WARN: 1,
          INFO: 2,
          SUCCESS: 3,
          DEBUG: 4,
          MORE: 5
        },
        colors: {
          FATAL: 'red',
          ERROR: 'red',
          WARN: 'yellow',
          INFO: 'cyan',
          SUCCESS: 'green',
          DEBUG: 'magenta',
          MORE: 'gray'
        }
      }
    };

    this.initLogger(OPTIONS);
    this.log(5, '[-] New logger : ' + loggerName);
    this.log(5, '[-] Logs output in : ' + CONFIG.LOGS_PATH);
  }

  /**
   * Initialize the winston logger
   * @param  {JSON} OPTIONS   Options for the logger
   */
  initLogger(OPTIONS) {
    this.logger = Winston.createLogger({
      levels: OPTIONS.customLevels.levels,
      colorize: true,
      format: Winston.format.json(),
      transports: [
        new Winston.transports.File( OPTIONS.transport.file ),
        new Winston.transports.Console( OPTIONS.transport.console )
      ]
    });
    Winston.addColors(OPTIONS.customLevels.colors);
  }

  /**
   * Return the name of the log that correspond to the id given
   * @param  {Number} idLvl   Id of the lvl
   * @return {JSON}           Id and value that correspond to that id
   */
  getLevel(idLvl) {
    let levels = [
      {'id': -1, 'libelle': "FATAL"},
      {'id': 0, 'libelle': "ERROR"},
      {'id': 1, 'libelle': "WARN"},
      {'id': 2, 'libelle': "INFO"},
      {'id': 3, 'libelle': "SUCCESS"},
      {'id': 4, 'libelle': "DEBUG"},
      {'id': 5, 'libelle': "MORE"},
    ]
    return R.find(R.propEq('id', idLvl))(levels).libelle
  }

  /**
   * Send a log message and save it in a logs file
   * @param  {int}      level   Log level
   * [-1: FATAL, 0: ERROR, 1: WARN, 2: INFO, 3: SUCCESS, 4: DEBUG, 5: MORE]
   * @param  {String}   message Message to put in the log
   */
  log(level, message, error) {
    try{
      level = this.getLevel(level);
      if(level == 0 && error){ this.contextAdd('ERR', error); }
      this.logger.log({
        'timestamp' : Math.round(Date.now()/1000),
        'level' : level,
        'app' : {
                'name': CONFIG.BOT.NAME,
                'version': CONFIG.BOT.VERSION,
              },
        'message': message,
        'context': this.context,
      });
    }catch(err){
      console.error(err)
    }
    this.contextRemove('ERR');
  }

  /**
   * Add a key value couple in the context of the logger
   * If the key already exist it will replace it
   * @param  {String} key    Key that will define the couple
   * @param  {any}    value  Value to put in the context
   * @return {Boolean | any}        true if the key was added, if it was replace it return the old value
   */
  contextAdd(key, value) {
    let index = R.findIndex(R.propEq('key', key))(this.context);
    if(index === -1){
      this.context.push({'key': key, 'value': value || ''});
      return true;
    } else {
      oldValue = this.context[index].value;
      this.context[index].value = value;
      return oldValue;
    }
  }

  /**
   * Remove an item in the context by his key
   * @param  {String} key The value of the key to remove
   * @return {JSON}       the item that has been removed
   */
  contextRemove(key) {
    let index = R.findIndex(R.propEq('key', key))(this.context);
    if(index === -1){
      return index;
    } else {
      this.context = R.remove(index, 1, this.context);
    }
  }

  /**
   * Remove the last thing added in the context
   * @return {JSON} Last item
   */
  contextRemoveLast(){
    return this.context.pop()
  }
}

module.exports = Logger;

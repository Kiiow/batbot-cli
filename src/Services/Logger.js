const Winston = require('Winston');
const R = require('ramda');

const CONFIG = require('../Config');
const Global = require('../../function/globalFunc.js');

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

  getLevel(id_lvl) {
    let levels = [
      {'id': -1, 'libelle': "FATAL"},
      {'id': 0, 'libelle': "ERROR"},
      {'id': 1, 'libelle': "WARN"},
      {'id': 2, 'libelle': "INFO"},
      {'id': 3, 'libelle': "SUCCESS"},
      {'id': 4, 'libelle': "DEBUG"},
      {'id': 5, 'libelle': "MORE"},
    ]
    return R.find(R.propEq('id', id_lvl))(levels).libelle
  }

  /**
   * Send a log message and save it in a logs file
   * @param  {int}      level   [Level of the log]
   * @infos             level [-1: FATAL, 0: ERROR, 1: WARN, 2: INFO, 3: SUCCESS, 4: DEBUG, 5: MORE]
   * @param  {String}   message [Message]
   */
  log(level, message) {
    try{
      this.logger.log({
        'timestamp' : Math.round(Date.now()/1000),
        'level' : this.getLevel(level),
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
  }

  contextAdd(key, value) {
    let index = R.findIndex(R.propEq('key', key))(this.context);
    if(index === -1){
      this.context.push({'key': key, 'value': value || ''});
    } else {
      this.context[index].value = value;
    }
  }

  contextRemove(key) {
    let index = R.findIndex(R.propEq('key', key))(this.context);
    if(index === -1){
      return index;
    } else {
      this.context = R.remove(index, 1, this.context);
    }
  }

  contextRemoveLast(){
    return test.pop()
  }
}

module.exports = Logger;

const CONFIG = require('./src/Config');
// const Logger = new(require('./src/Services/Logger'))("appLogger");

const Logger = require('./src/LoggerFactory');

const MessageAnalyzer = require('./src/Services/MessageAnalyzer');
const CommandsExecuter = require('./src/Services/CommandsExecuter');

const Discord = require('discord.js');
const BatBot = new Discord.Client();

Logger.log(2, 'Starting App');

// Bot connexion with his token
BatBot.login(CONFIG.BOT.TOKEN)
  .then(() => {
    Logger.log(3, 'Bot connected ');
  })
  .catch((err) => {
    Logger.log(0, 'Error while trying to connect to discord whit token [' + CONFIG.BOT.TOKEN + ']');
  });

// When Bot connected
BatBot.on('ready', () => {
  BatBot.user.setPresence(CONFIG.BOT.STATUS);
});

BatBot.on('message', (message) => {
  const ANALYZER = new MessageAnalyzer(message, BatBot);

  ANALYZER.AnalyzeMsg()
    .then( (data) => {

      Logger.log(5, 'This is a correct command');
      const EXECUTER = new CommandsExecuter(message);
      EXECUTER.ExecuteCommand(data)
        .then( (_data) => {
          Logger.log(5, 'Do something after command execution');
        })
        .catch( (error) => {
          Logger.contextAdd('ERR', error);
          Logger.log(0, error);
          Logger.contextRemove('ERR');
        })

    })
    .catch( (error) => {
      Logger.log(0, error);
    })
    .finally( () => {
      // TODO add xp si message length >= 15 && start pas par prefix
      Logger.log(5, 'Do something after every message');
    });

});

// If CTRL+C to stop
process.on('SIGINT', () => {
  Logger.log(5, 'Stopping bot manually (CTRL+C)');
  process.exit(2);
});

// If Uncaught Expression ...
process.on('uncaughtException', (error) => {
  Logger.log(-1, '[Uncaught Expression] ' + error.message);
  console.log(error.stack);
  process.exit(99);
});

const CONFIG = require('./src/Config');
console.log(CONFIG);

const Logger = require('./src/LoggerFactory');
const MessageAnalyzer = require('./src/Services/MessageAnalyzer');
const MessageSender = new (require('./src/Services/MessageSender'))(undefined);
const CommandsExecuter = require('./src/Services/CommandsExecuter');
const LevelManager = require('./src/Services/LevelManager');
const Brain = require('./src/Services/Brain');
const UserDal = require('./src/Dal/UserDAL');

const Discord = require('discord.js');
const BatBot = new Discord.Client();
const R = require('ramda');

Logger.log(2, 'Starting App');

// Bot connexion with his token
BatBot.login(CONFIG.BOT.TOKEN)
  .then(() => {
    Logger.log(3, `${CONFIG.BOT.NAME} connected `);
  })
  .catch((err) => {
    Logger.log(-1, 'Error while trying to connect to discord whit token [' + CONFIG.BOT.TOKEN + ']', err);
  });

// When Bot connected
BatBot.on('ready', () => {
  BatBot.user.setPresence(CONFIG.BOT.STATUS);
});

BatBot.on('message', (message) => {
  if(message.author.bot) return false;
  const ANALYZER = new MessageAnalyzer(message, BatBot);

  ANALYZER.AnalyzeMsg()
    .then( (data) => {
      Logger.log(5, 'This is a correct command');
      const EXECUTER = new CommandsExecuter(message, BatBot);
      EXECUTER.ExecuteCommand(data)
        .then( (_data) => {
          Logger.log(5, 'Do something after command execution');
        })
        .catch( (error) => {
          Logger.log(0, error);
        })

    })
    .catch( (error) => {
      if(error == undefined) return;
      switch(error.name) {
        case "FetchError":
          Logger.log(-1, `The API doesn't seem to be launched, or isn't accessible !`);
          MessageSender.setMessage(message).sendError("Problème de configuration du bot, veuillez contacter un admin");
          break;
        default:
          Logger.log(0, error, error);
      }
    })
    .finally( () => {
      Logger.log(5, 'Do something after every message');
      if(!ANALYZER.isCommand && CONFIG.BOT.SETTINGS.BRAIN) {
        let BRAIN = new Brain(message, BatBot);
        BRAIN.ThinkAndSpeak()
          .then( (data) => {
            BRAIN.TreatmentData(data);
          })
          .catch( (err) => {
            switch(err) {
              case undefined:
                Logger.log(5, 'Bot not mentionned');
                break;
              default:
                console.log(err);
                Logger.log(0, 'Error', err);
                break;
            }
          })
      }
    });

    const LEVEL_MANAGER = new LevelManager(message, BatBot);
    if(LEVEL_MANAGER.canEarnXp()) {
      LEVEL_MANAGER.addXp()
        .then( (user) => {
          UserDal.updateUserXp(user)
            .then( (_data) => { Logger.log(2, `Added xp to ${user.fullName()}`); })
            .catch( (err) => { Logger.log(0, `Error while trying to add xp to user ${user.fullName}`,err); })
        })
        .catch( (err) => {
          if(err) Logger.log(0, `Erreur lors de l'ajout d'xp à l'utilisateur`, err);
        })
    }

});

// If CTRL+C to stop
process.on('SIGINT', () => {
  Logger.log(4, 'Stopping bot manually (CTRL+C)');
  process.exit(2);
});

// Kill the bot when process exit
process.on('exit', () => {
  Logger.log(4, `${CONFIG.BOT.NAME} disconnected`);
  BatBot.destroy();
})

// If Uncaught Expression ...
process.on('uncaughtException', (error) => {
  Logger.log(-1, '[Uncaught Expression] ', error);
  console.log(error);
  console.log('-----------------------------');
  console.log(error.stack);
  process.exit(99);
});

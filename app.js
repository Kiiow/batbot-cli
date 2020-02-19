const CONFIG = require('./src/Config');

const Logger = require('./src/LoggerFactory');
const MessageAnalyzer = require('./src/Services/MessageAnalyzer');
const CommandsExecuter = require('./src/Services/CommandsExecuter');
const LevelManager = require('./src/Services/LevelManager');
const UserDal = require('./src/Dal/UserDAL');

const Discord = require('discord.js');
const BatBot = new Discord.Client();

Logger.log(2, 'Starting App');

// Bot connexion with his token
BatBot.login(CONFIG.BOT.TOKEN)
  .then(() => {
    Logger.log(3, `${CONFIG.BOT.NAME} connected `);
  })
  .catch((err) => {
    Logger.log(0, 'Error while trying to connect to discord whit token [' + CONFIG.BOT.TOKEN + ']', err);
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
      Logger.log(0, error);
    })
    .finally( () => {
      Logger.log(5, 'Do something after every message');
    });

    const LEVEL_MANAGER = new LevelManager(message, BatBot);
    if(LEVEL_MANAGER.canEarnXp()) {
      LEVEL_MANAGER.addXp()
        .then( (user) => {
          UserDal.updateUserXp(user)
            .then( (data) => { Logger.log(2, `Added xp to ${user.fullName()}`); })
            .catch( (err) => { Logger.log(0, `Error while trying to add xp to user ${user.fullName}`,err); })
        })
        .catch( (err) => {
          if(err) {
            Logger.log(0, `Erreur lors de l'ajout d'xp à l'utilisateur`, err);
          }
        })
    }

});

// If CTRL+C to stop
process.on('SIGINT', () => {
  Logger.log(5, 'Stopping bot manually (CTRL+C)');
  process.exit(2);
});

// Kill the bot when process exit
process.on('exit', () => {
  Logger.log(4, `${CONFIG.BOT.NAME} disconnected`);
  BatBot.destroy();
})

// If Uncaught Expression ...
process.on('uncaughtException', (error) => {
  Logger.log(-1, '[Uncaught Expression] ' + error.message);
  console.log(error.stack);
  process.exit(99);
});

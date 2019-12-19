const Discord = require('discord.js');
const Bot = new Discord.Client();
const fs = require('fs');

const globalFunc = require('./function/globalFunc.js');
const adminFunc = require('./function/adminFunc.js');
const msgFunc = require('./function/msgFunc.js');
const level = require('./command/level.js');

const CONFIG = {
  PROJECT_PATH: process.env.PROJECT_PATH || __dirname,
  BOT: {
    NAME: process.env.BOT_NAME || "BatBot",
    PROFIL_PICTURE: process.env.BOT_PROFIL_PICTURE || "",
    TOKEN: process.env.BOT_TOKEN || "",
    PREFIX: process.env.BOT_PREFIX || ".",
    STATUS: {
      "game": {
        "name": process.env.BOT_STATUS_MESSAGE || "(.help)",
        "type": process.env.BOT_STATUS_TYPE || "PLAYING",
      }
    }
  }
}

const global = new globalFunc();
console.log(__dirname)
global.log(2, 'Starting App');
Bot.on('ready', () => {
  let bot_data = {
    name : Bot.user.username,
    id : Bot.user.id,
    discriminator : Bot.user.discriminator
  };
  adminFunc.getJSONData("/../config", (err, JSONObj) => {
    JSONObj.bot_data = bot_data;
    // console.log(JSONObj);
    fs.writeFile('./config.json', JSON.stringify(JSONObj, null, '\t'), 'utf8', function(err, data){
      if(err){
        console.error(err);
        global.log(0, 'Cannot save bot infos');
      }
      global.log(3, 'Successfully saved bot info');
    });
  });
  Bot.user.setPresence(CONFIG.BOT.STATUS);
});


Bot.on('message', (message) => {
  let func;
  if(message.channel.type == 'dm') return false;
  // Pour désactiver l'xp \/
  if(message.content.length >= 15 && !message.content.startsWith('.')){
    level.action(message, global);
  }
  if(message.content.startsWith(CONFIG.BOT.PREFIX)) func = ((message.content.split(" "))[0]).substr(1);
  if(message.content.startsWith('<@' + Bot.user.id + '>')){
    func = (message.content.split(" "))[1];
    if(func == undefined) func = "help";
    message.content = message.content.replace('<@' + Bot.user.id + '> ', '.');
  }

  if(func != undefined){
    adminFunc.getJSONData("commands", (err, JSONObj) => {
      let userCommand;
      JSONObj.Commands.map( (command) => {
        if(command.name == func){
            userCommand = command;
        }
      });
      if(userCommand != undefined && userCommand.active_command == 1){
        global.log(2, 'Function detected [.' + func + ']');
        try {
          const userFunc = require("./command/" + userCommand.filename + ".js");
          let t = userFunc[userCommand.function](message, global);
        }catch (err){
          if(err.message.match(/function$/))
            global.log(0, 'Function non trouvée : {' + userCommand.filename + "." + userCommand.function + '}');
          else
            global.log(0, err.message)
            global.log(0, 'Fichier non trouvé : {./command/' + userCommand.filename + '.js}');
          msgFunc.sendError(message, errMsg);
        }
      }
    });
  }
});

// Connexion du Bot avec son Token
Bot.login(CONFIG.BOT.TOKEN)
  .then(() => {
    global.log(3, 'Bot connected ');
  })
  .catch((err) => {
    if(err) global.log(0, 'Error while trying to connect to discord whit token [' + CONFIG.BOT.TOKEN + ']');
  });

// Si CTRL+C pour stop
process.on('SIGINT', function () {
  global.log(4, 'Stopping bot manually (CTRL+C)');
  process.exit(2);
});

// Si Uncaught Expression ...
process.on('uncaughtException', function(e) {
  global.log(-1, '[Uncaught Expression] ' + e.message);
  console.log(e.stack);
  process.exit(99);
});

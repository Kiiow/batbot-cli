const Discord = require('discord.js');
const Bot = new Discord.Client();
const Config = require('./config.json');
const fs = require('fs');

const globalFunc = require('./function/globalFunc.js');
const adminFunc = require('./function/adminFUnc.js');
const msgFunc = require('./function/msgFunc.js');
const level = require('./command/level.js');

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
      if(err) console.error(err);
    });
  });
  Bot.user.setPresence(Config.standard.presence);
  console.log('bot Online');
});


Bot.on('message', (message) => {
  let func;
  if(message.channel.type == 'dm') return false;
  // Pour désactiver l'xp \/
  if(message.content.length >= 15 && !message.content.startsWith('.')) level.action(message);
  if(message.content.startsWith(Config.standard.prefix)) func = ((message.content.split(" "))[0]).substr(1);
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
        try {
          const userFunc = require("./command/" + userCommand.filename + ".js");
          let t = userFunc[userCommand.function](message);
        }catch (err){
          let errMsg = "ERROR : ";
          // console.log(err.message);
          if(err.message.match(/function$/)){
            errMsg += "Function non trouvée : {" + userCommand.filename + "."+ userCommand.function +"}";
          }else{
            errMsg = "Fichier non trouvé : {./command/" + userCommand.filename + ".js}";
          }
          console.log(errMsg);
          msgFunc.sendError(message, errMsg);
        }
      }
    });
  }
});



// Connexion du Bot avec son Token
Bot.login(Config.standard.token);

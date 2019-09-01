const Discord = require('discord.js');
const Bot = new Discord.Client();
const Config = require('./config.json');
const fs = require('fs');

const globalFunc = require('./function/globalFunc.js');
const adminFunc = require('./function/adminFUnc.js');
const level = require('./command/level.js');

Bot.on('ready', () => {
  Bot.user.setPresence(Config.dev.presence);
  console.log('bot Online');
});


Bot.on('message', (message) => {
  let func;
  if(message.channel.type == 'dm') return false;
  // Pour désactiver l'xp \/
  // if(message.content.length >= 15 && !message.content.startsWith('.')) level.action(message);
  if(message.content.startsWith(Config.dev.prefix)) func = ((message.content.split(" "))[0]).substr(1);
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
        const userFunc = require("./command/" + userCommand.filename + ".js");
        let t = userFunc[userCommand.function](message);
      }
    });
  }
});



// Connexion du Bot avec son Token
Bot.login(Config.dev.token);

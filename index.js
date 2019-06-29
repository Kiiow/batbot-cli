const Discord = require('discord.js');
const Bot = new Discord.Client();

const ping = require('./command/ping.js');
const level = require('./command/level.js');
const admin = require('./command/admin.js');
const dictator = require('./command/dictator.js');
const stop = require('./command/stop.js');
const clear = require('./command/clear.js');
const wiki = require('./command/wiki.js');
const blague = require('./command/blague.js');
const infos = require('./command/infos.js');

var myFunc = {
  ping : { filename : ping, action : "action" },
  add_admin : { filename : admin, action : "add_admin" },
  stop : { filename : stop, action : "action" },
  kick : { filename : dictator, action : "kick" },
  ban : { filename : dictator, action : "ban" },
  prison : { filename : dictator, action : "prison" },
  clear : { filename: clear, action: "delete" },
  wiki : { filename : wiki, action: "search"},
  blague : { filename: blague, action: "getRandomBlague" },
  profile : { filename: infos, action: "getProfile" },
  help : { filename: infos, action: "botCommandsInfos" }
};

Bot.on('ready', function(){
  console.log('bot Online');
});


Bot.on('message', function(message){
  let func;
  if(message.channel.type == 'dm') return false;
  if(message.content.length >= 15) level.action(message);
  if(message.content.startsWith('.')) func = ((message.content.split(" "))[0]).substr(1);
  if(message.content.startsWith('<@' + Bot.user.id + '>')){
    func = (message.content.split(" "))[1];
    if(func == undefined) func = "help";
    message.content = message.content.replace('<@' + Bot.user.id + '> ', '.');
  }
  if(func != undefined){
    if(myFunc[func] != undefined){
      let action = myFunc[func].action;
      let filename = myFunc[func].filename;
      filename[action](message);
    }else console.log("function " + func + " does not exist");
  }
  return false;
});



// Connexion du Bot avec son Token
Bot.login((require('./config.json')).token);

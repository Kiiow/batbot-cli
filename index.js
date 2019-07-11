const Discord = require('discord.js');
const Bot = new Discord.Client();
const Config = require('./config.json');

const globalFunc = require('./function/globalFunc.js');

const ping = require('./command/ping.js');
const level = require('./command/level.js');
const admin = require('./command/admin.js');
const dictator = require('./command/dictator.js');
const stop = require('./command/stop.js');
const clear = require('./command/clear.js');
const wiki = require('./command/wiki.js');
const blague = require('./command/blague.js');
const infos = require('./command/infos.js');
const pokeload = require('./command/pokeload.js');
const pokeInfo = require('./command/pokeinfo.js');
const emoji = require('./command/emoji.js');

var myFunc = {
  ping : { filename : ping, action : "action" },
  admin_add : { filename : admin, action : "add_admin" },
  stop : { filename : stop, action : "action" },
  kick : { filename : dictator, action : "kick" },
  ban : { filename : dictator, action : "ban" },
  prison : { filename : dictator, action : "prison" },
  clear : { filename: clear, action: "delete" },
  wiki : { filename : wiki, action: "search"},
  blague : { filename: blague, action: "getRandomBlague" },
  profile : { filename: infos, action: "getProfile" },
  help : { filename: infos, action: "botCommandsInfos" },
  // pokeload : { filename: pokeload, action: "pokeLoad" },
  pokeinfo : { filename: pokeInfo, action: "pokeInfo" },
  pokestats : { filename: pokeInfo, action: "pokeStats" },
  emoji_add : { filename: emoji, action: "addEmoji"},
  emojilist : { filename: emoji, action: "emojiList" },
  top : { filename: infos, action: "top" }
};

Bot.on('ready', function(){
  Bot.user.setPresence({
    game: {
      name: 'vos messages (.help)',
      type: "WATCHING"
    }
  });
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
  if(func != undefined && myFunc[func] != undefined){
    let action = myFunc[func].action;
    let filename = myFunc[func].filename;
    globalFunc.addLogs(message, func);
    filename[action](message);
  }
  return false;
});



// Connexion du Bot avec son Token
Bot.login(Config.token);

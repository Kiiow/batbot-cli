const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');

class Announce{

  static announce(message){
    message.delete();
    let annonceMsg;
    adminFunc.isAdmin(message.author.id, (err, admin) =>{
      if(admin){
        annonceMsg = (adminFunc.removeItemByString(message.content.split(' '), '.announce')).join(' ');
        if(annonceMsg == ""){
          msgFunc.sendError(message, "Vous devez spécifier quelquechose à annoncer");
        }else{
          adminFunc.getJSONData('data', (err, JSONObj) => {
            let serverId = message.guild.id;
            let server, channel;
            JSONObj.servers.map(serv => {
              if(serv.id == serverId) server = serv;
            });
            if(server == undefined || server.announce == undefined){
              msgFunc.sendError(message, "Vous devez d'abord configurer le channel d'annonce de votre serveur `.config announce <channel>`");
            }else {
              message.guild.channels.map(chan => {
                if(server.announce == chan.id) channel = chan;
              });
              msgFunc.sendEmbed(channel, {
                author_name: message.member.displayName,
                author_avatar: message.author.avatarURL,
                description : annonceMsg
              }, true);
            }
          });
        }
      }else{
        msgFunc.sendError(message, "Vous devez être admin pour créer des annonces");
      }
    });
  }

}
module.exports = Announce;

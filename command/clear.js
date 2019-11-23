const adminFunc = require ('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Clear{

  static delete(message, logger){
    adminFunc.isAdmin(message.author.id, function(err, admin){
      if(admin){
        var nbMessage = parseInt((message.content.split(" "))[1]);
        if(!isNaN(nbMessage)){
          message.channel.bulkDelete(nbMessage+1)
            .catch(console.error);
          if((message.content.split(" "))[2] != undefined){
            var s = '';
            if(nbMessage > 1) s = 's';
            msgFunc.sendEmbed(message, {
              color : 65280,
              author_name : message.member.displayName,
              author_avatar : message.author.avatarURL,
              description : "Vous avez supprimé " + nbMessage + " message" + s +" !"
            });
            logger.log(3, `[${this.name}] Successfully cleared ${nbMessage}`);
          }
        }else{
          msgFunc.sendEmbed(message, {
            color : 16711680,
            author_name : message.member.displayName,
            author_avatar : message.author.avatarURL,
            description : "Vous devez donner un nombre de message à supprimer"
          });
          logger.log(1, `[${this.name}] No amount of message foud`);
        }
      }else{
        msgFunc.sendEmbed(message, {
          color : 16711680,
          author_name : message.member.displayName,
          author_avatar : message.author.avatarURL,
          description : "Vous devez être administrateur pour supprimer des messages"
        });
        logger.log(1, `[${this.name}] Trying to clear message while not being admin`);
      }
    });
  }

}
module.exports = Clear;

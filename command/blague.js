const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Blague{

  static getRandomBlague(message, logger){
    message.delete();
    adminFunc.ajaxRequest('http://www.blague.org/', (err, content) => {
      var blague = content.substring(content.search('</h1>') + 5, content.search('</div>'));
      blague = blague.replace(/<br>/gi, '');
      msgFunc.sendEmbed(message, {
        author_name: message.member.displayName,
        author_avatar: message.author.avatarURL,
        description: blague,
        footer : 'http://www.blague.org/'
      });
      logger.log(3, `[${this.name}] Successfully generated a joke`);
    });
  }
}
module.exports = Blague;

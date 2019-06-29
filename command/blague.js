const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Blague{

  static getRandomBlague(message){
    message.delete();
    adminFunc.ajaxRequest('http://www.blague.org/', function(err, content){
      // console.log(content);
      var blague = content.substring(content.search('</h1>') + 5, content.search('</div>'));
      blague = blague.replace(/<br>/gi, '');
      msgFunc.sendEmbed(message, {
        author_name: message.member.displayName,
        author_avatar: message.author.avatarURL,
        description: "** **\n" + blague + "\n** **",
        footer : 'http://www.blague.org/'
      });
      // console.log(blague);
    });
  }
}
module.exports = Blague;

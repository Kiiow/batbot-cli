const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Wiki{

  static search(message){
    message.delete();
    var searchItem = (adminFunc.removeItemByString(message.content.split(' '), '.wiki')).join(' ');
    if(searchItem == undefined){
      msgFunc.sendError(message, "Vous devez renseigner quelque chose à rechercher `.wiki <info>`");
      return false;
    }else{
      searchItem = searchItem.replace(' ', '%20');
    }
    var url = this.createWikiUrl(searchItem);
    adminFunc.ajaxRequest(url, function(err, body){
      if(body.error == undefined){
        var linkPage = "\n**[" + String(body[1]) +"](" + String(body[3]) + ") **\n\n";
        msgFunc.sendEmbed(message, {
          author_name : message.member.displayName,
          author_avatar : message.author.avatarURL,
          description : linkPage + String(body[2]),
          url : String(body[3]),
          footer : message.content
        });
      }
    });
  }

  static createWikiUrl(searchItem){
    var url = 'https://fr.wikipedia.org/w/api.php?';
    var param = 'action=opensearch&search=';
    param += searchItem;
    param += '&limit=1&format=json';
    return url+param;
  }

}
module.exports = Wiki;

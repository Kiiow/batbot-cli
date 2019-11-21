const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Search{


  static ggleSearch(message, logger){
    message.delete();
    var searchItem = (adminFunc.removeItemByString(message.content.split(' '), '.google')).join(' ');
    if(searchItem == ""){
      msgFunc.sendError(message, "Vous devez renseigner quelque chose à rechercher `.wiki <info>`");
      logger.log(1, `[${this.name}] Can't search nothing`);
      return false;
    }else{
      searchItem = searchItem.replace(/ /gi, '%20');
      msgFunc.sendEmbed(message, {
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description : "Voila le lien vers [votre recherche](https://www.google.com/search?q=" + searchItem + ") !",
        footer : "https://www.google.com/search?q=" + searchItem
      });
      logger.log(2, `[${this.name}] Doing research on [${searchItem}]`);
    }
  }


}
module.exports = Search;

const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Stop{

  static action(message, logger){
    message.delete();
    adminFunc.isAdmin(message.author.id, (err, admin) => {
      if(admin){
        message.channel.send(`A bientôt ...`);
        setTimeout( () => {
          logger.log(2, `[${this.name}] Stopping BatBot`);
          process.exit();
        }, 500);
      }else msgFunc.sendError(message, `Vous devez être admin pour m'éteindre`);
    });

  }

}
module.exports = Stop;

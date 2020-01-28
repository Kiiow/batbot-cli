const Command = require('../src/Command.js');

class Ping extends Command{
  static action(message){
    message.channel.send('Pong :ping_pong:');
    this.log(2, `[${this.getClassName()}] Pinging BatBot`);
  }
}
module.exports = Ping;

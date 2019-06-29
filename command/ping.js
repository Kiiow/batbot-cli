class Ping{
  static action(message){
    message.channel.send('pong');
  }
}
module.exports = Ping;

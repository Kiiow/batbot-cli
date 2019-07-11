class Ping{
  static action(message){
    message.channel.send('Pong :ping_pong:');
    // console.log(message.author.presence.game);
  }
}
module.exports = Ping;

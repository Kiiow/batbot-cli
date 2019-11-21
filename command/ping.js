class Ping{
  static action(message, logger){
    message.channel.send('Pong :ping_pong:');
    logger.log(2, `[${this.name}] Pinging BatBot`);
  }
}
module.exports = Ping;

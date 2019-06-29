class Stop{
  static action(message){
    message.channel.send("A bientôt ...");
    setTimeout(function(){
      process.exit();
    }, 500);
  }
}
module.exports = Stop;

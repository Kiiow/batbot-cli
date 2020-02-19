const Command = require('../Command');
const AccessData = require('../Services/AccessData');

class Blague extends Command {

  static async action(message) {
    message.delete();
    this.log(2, `${message.author.username}is asking for a joke`);
    let url = "https://blague.xyz/api/joke/random";
    let header = {
        'headers': {
        'Content-Type': "application/json",
        'Authorization' : this.getConfig().API.BLAGUE_TOKEN,
      }
    }
    AccessData.get(url, header)
      .then( (data) => {
        let question = data.joke.question;
        let answer = data.joke.answer;
        this.msg(message).sendEmbed({
          'author_name': message.author.username,
          'author_avatar': message.author.avatarURL,
          'description': `${question}\n ||${answer}||`,
          'footer': "https://blague.xyz"
        });
        this.log(2, `Got a joke from ${url} with id ${data.joke.id}`)
      })
      .catch( (err) => {
        this.msg(message).sendError(`Erreur lors de l'accès aux données veuillez contacter un administrateur ou réessayer plus tard.`)
        this.log(0, `Error while trying to get a joke from ${url}`, err)
      })
  }
}


module.exports = Blague;

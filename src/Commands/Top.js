const Command = require('../Command');
const UserDal = require('../Dal/UserDAL');
const R = require('ramda');

class Top extends Command {

  /**
   * Display the users leaderboard in term of xp
   *
   * @param  {Discord.message} message User message
   */
  static action(message) {
    UserDal.getAllUser()
      .then( (userList) => {
        let rankEmote = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

        this.log(2, `Displaying the leaderboard`);

        const SORT_BY_XP = R.sortBy(R.prop('xp'))
        let userSorted = R.reverse(SORT_BY_XP(userList));

        let value = [];
        let i =0;
        while(i < 10 && i < userSorted.length){
          value.push( `${rankEmote[i]} -- **${userSorted[i].nickname}** *[xp: ${userSorted[i].xp}]*`);
          i++;
        }
        this.msg(message).sendEmbed({
          'fields': [{
              'name': `**:trophy:  Classement: **`,
              'value': `** **\n${value.join('\n')}`,
            }]
        });
      })
      .catch( (err) => {
        console.log(err);
        this.log(0, `Error while trying to get every Users`, err);
      })
  }
}

module.exports = Top

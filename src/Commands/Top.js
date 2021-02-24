const Command = require('../Command.js');
const UserDal = require('../Dal/UserDAL.js');
const R = require('ramda');
const CustomDate = require('../Services/CustomDate.js');

class Top extends Command {

  /**
   * Display the users leaderboard in term of xp
   *
   * @param  {Discord.message} message User message
   */
  static action(message) {
    UserDal.getAllUser()
      .then( (userList) => {
        this.log(2, `Displaying the leaderboard`);

        const SORT_BY_XP = R.sortBy(R.prop('xp'))
        let userSorted = R.reverse(SORT_BY_XP(userList));

        let value = [];
        const CLASSEMENT = {
          'rankEmote': [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"],
          'userName': [],
          'levelXp': []
        }
        let i =0;
        while(i < 10 && i < userSorted.length){
          value.push( `${CLASSEMENT.rankEmote[i]} -- **${userSorted[i].nickname}** *[xp: ${userSorted[i].xp}]*`);
          CLASSEMENT.userName.push(`<@!${userSorted[i].id}>`);
          CLASSEMENT.levelXp.push(`${userSorted[i].level} (**${userSorted[i].xp}**)`);
          i++;
        }

        /*let variable = {
          'author_name': `${userName}#${discriminator}`,
          'description': `** **`,
          'thumbnail': avatarURL,
          'fields': [
            {'name': 'User', 'value': `<@!${member.id}>`},
            {'name': 'Level', 'value': `${userInfo.level}`, 'inline': true},
            {'name': 'XP', 'value': `${userInfo.xp}/**${LevelService.xpNeed(userInfo.level)}**`, 'inline': true},
            {'name': 'Status', 'value': status},
            {'name': 'Rank', 'value': `${rankNumber}/${userList.length}`, 'inline': true},
          ],
        }*/

        this.msg(message).sendEmbed({
          'author_name': 'Classement',
          'author_avatar': 'https://emoji.gg/assets/emoji/1238_Trophy.png',
          'fields': [{
              'name': `Rank`,
              'value': `${CLASSEMENT.rankEmote.join('\n')}`,
              'inline': true
            },
            {
              'name': `User`,
              'value': `${CLASSEMENT.userName.join('\n')}`,
              'inline': true
            },
            {
              'name': `Level / Xp`,
              'value': `${CLASSEMENT.levelXp.join('\n')}`,
              'inline': true
            }
          ],
          'footer': CustomDate.getCurrentDateFormatted()
        });
      })
      .catch( (err) => {
        console.log(err);
        this.log(0, `Error while trying to get every Users`, err);
      })
  }
}

module.exports = Top

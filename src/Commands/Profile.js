const Command = require('../Command');
const UserDal = require('../Dal/UserDAL');
const LevelService = require('../Services/Level/LevelService');
const R = require('ramda');

class Profile extends Command {

  static async action(message, Bot) {
    this.log(2, "Accessing profile infos");
    message.delete();
    let userMention = message.mentions.members.first();
    if(userMention) {
      // If user is bot && only 1 mention && first param match user mention regex
      if(userMention.user.bot == true && message.mentions.members.array().length == 1 && message.oldContent == undefined) {
        this.log(1, "Trying to display bot profile")
        this.msg(message).sendError("Vous ne pouvez pas voir le profil d'un bot");
        return;
      } else {
        if(message.oldContent && userMention.user.bot == true) {
          this.displayOwnProfile(message);
          return;
        } else {
          this.log(2, "Displaying someone profile");
          try {
            let userInfo = await UserDal.getUserById(userMention.id);
            this.msg(message).sendEmbed(await this.getProfile(userMention, userInfo));
          } catch (error) {
            this.msg(message).sendError(`Erreur lors de la récupération du profile de \`${userMention.user.username}#${userMention.user.discriminator} - (${userMention.displayName})\``)
          }
        }
      }

    } else {
      this.displayOwnProfile(message);
      // this.log(2, "Displaying own profile");
      // let member = message.member;
      // try {
      //   let userInfo = await UserDal.getUserById(member.id);
      //   this.msg(message).sendEmbed(await this.getProfile(member, userInfo));
      // } catch (error) {
      //   console.log(error);
      //   this.log(0, `Error while trying to display profile`, error);
      //   this.msg(message).sendError(`Erreur lors de la récupération de votre profile`);
      // }

    }
  }

  static async displayOwnProfile(message) {
    this.log(2, "Displaying own profile");
    let member = message.member;
    try {
      let userInfo = await UserDal.getUserById(member.id);
      this.msg(message).sendEmbed(await this.getProfile(member, userInfo));
    } catch (error) {
      console.log(error);
      this.log(0, `Error while trying to display profile`, error);
      this.msg(message).sendError(`Erreur lors de la récupération de votre profile`);
    }
  }

  static async getProfile(member, userInfo) {
    let userList = await UserDal.getAllUser();
    const sortByXp = R.sortBy(R.compose(R.prop('xp')));
    userList = R.reverse(sortByXp(userList));
    let rankNumber = 1 + R.findIndex(R.propEq('id', member.id))(userList);
    let nickname = member.displayName;
    let userName = member.user.username;
    let avatarURL = member.user.avatarURL;
    let status = member.presence.status;
    let discriminator = member.user.discriminator;

    switch(status) {
      case "offline":
        status = ":red_circle: Offline";
        break;
      case "dnd":
        status = ":orange_circle: Do Not Disturb";
        break;
      case "online":
        status = ":green_circle: Online";
        break;
      case "idle":
        status = ":yellow_circle: Inactif";
        break;
    }
    let profile = {
      'author_name': `${userName}#${discriminator} - (${nickname})`,
      'author_avatar': avatarURL,
      'description': "---------------------------------------------------",
      fields: [
        {'name': 'Level', 'value': `${userInfo.level}`, 'inline': true},
        {'name': 'XP', 'value': `${userInfo.xp}/**${LevelService.xpNeed(userInfo.level)}**`, 'inline': true},
        {'name': 'Status', 'value': status},
        {'name': 'Rank', 'value': `${rankNumber}`, 'inline': true},
      ],
    }
    return profile;
  }
}

module.exports = Profile;

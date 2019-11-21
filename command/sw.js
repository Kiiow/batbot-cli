const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Sw{

  static swCommand(message, logger){
    this.logger = logger
    message.delete();
    let command = message.content.split(' ')[1];
    switch(command){
      case "info":
        this.monsterInfo(message);
        break;
      default:
        this.swDefault(message);
        break;
    }
  }

  static monsterInfo(message){

    let url = "https://swarfarm.com/api/v2/monsters/?format=json&obtainable=true&natural_stars__gte=2&name=";

    let monsterName = message.content.split(' ')[2];
    if(monsterName != undefined){
      url += monsterName;
    } else {
      this.logger.log(1, `[${this.name}] Can't search information about nothing`);
      return false;
    }
    this.logger.log(2, `[${this.name}] Searching information about ${monsterName}`);

    adminFunc.ajaxRequest(url, (err, data) => {
      // Si pas de monstre
      if(data.count == 0){
        msgFunc.sendError(message, "Le monstre " + message.content.split(' ')[2] + " n'existe pas");
        this.logger.log(2, `[${this.name}] The monste ${monsterName} doesn't exist`);
      }else if(data.count > 1){ // Si plusieurs monstres
        let nbMonster = parseInt(message.content.split(' ')[3]);
        if(nbMonster != undefined && !isNaN(nbMonster) && nbMonster-1 < data.count){
          this.sendMonsterInfo(data.results[nbMonster-1], message);
        }else{
          let monsterArray = [];
          data.results.forEach(function(monster){
            monsterArray.push("**" + monster.name + "**");
          });
          msgFunc.sendEmbed(message, {
              author_name : message.member.nickname,
              author_avatar : message.author.avatarURL,
              description: "Il existe plusieurs monstres commencant par `" + monsterName + "` : \n" + monsterArray.join(', ')
          });
          this.logger.log(3, `[${this.name}] Successfully found information about multiple monster `)
        }
      }else{ // Si un monstre
        this.sendMonsterInfo(data.results[0], message);
        this.logger.log(3, `[${this.name}] Successfully found information about one monster`)
      }
    });

  }

  static sendMonsterInfo(data, message){
    let urlInfo = "https://swarfarm.com/api/bestiary?com2us_id=" + data.com2us_id +"&format=json";
    adminFunc.ajaxRequest(urlInfo, function(err, data){
      data = data[0];
      let stars = "", leaderData;
      for(let i=0; i< data.natural_stars; i++){
        stars += ":star: ";
      }
      if(data.leader_skill != undefined){
        leaderData = "Increase the " + data.leader_skill.attribute + " of ally monster";
        if(data.leader_skill.element != null ) leaderData += " with " + data.leader_skill.element + " attribute";
        if(data.leader_skill.area != "Element") leaderData += " in the" + data.leader_skill.area;
        leaderData += " by " + data.leader_skill.amount + "%  ";
      }
      let monsterImg = "https://swarfarm.com/static/herders/images/monsters/" + data.image_filename;

      let fieldArray = [
        {
          name : "Name",
          value : data.name,
          inline : true
        },
        {
          name : "Natural Stars",
          value : stars,
          inline : true
        }
      ];
      if(leaderData != undefined){
        fieldArray.push({
          name : "Leader skill",
          value : leaderData + "\n** **",
        });
      }
      data.skills.forEach(function(skill){
        fieldArray.push({
          name : skill.name,
          value : skill.description
        });
      });

      let val = {
        author_name : message.member.nickname,
        author_avatar : message.author.avatarURL,
        description: "\n** **",
        thumbnail : monsterImg,
        fields : fieldArray
      };
      msgFunc.sendEmbed(message, val);
    });

  }

  /**
   * Message par défaut de la commande sw (liste des commandes)
   * @param  {[Discord.message]} message Message discord à traiter
   */
  static swDefault(message){
    msgFunc.sendEmbed(message, {
      fields: [
        {
          name: "Commande(s) `.sw` :",
          value: ":newspaper: **`.sw info <monster> (nb)`** -- Affiche les informations du monstre"
        }
      ]
    });
  }

}
module.exports = Sw;

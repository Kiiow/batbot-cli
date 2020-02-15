const Commands = require('../../../Command');
const AccessData = require('../../../Services/AccessData');

const SWARFARM_LINK = "https://swarfarm.com/api";
const SW_MONSTER_API_URL = `${SWARFARM_LINK}/v2/monsters/`;
const SW_BESTIARY_API_URL = `${SWARFARM_LINK}/bestiary`;

class MobsInfos extends Commands {

  static async action(message) {
    this.message = message;
    let url = `${SW_MONSTER_API_URL}?format=json&obtainable=true&natural_stars__gte=2&name=`;
    const MONSTER_NAME = message.content.split(' ')[2];

    if(MONSTER_NAME) {
      url = `${url}${MONSTER_NAME}`;
      this.log(2, `Looking for informations about ${MONSTER_NAME}`);
    }
    else {
      this.msg(message).sendError(`Vous devez renseinger le nom d'un monstre à rechercher ! \`sw info <monster> (n°)\``)
      this.log(0, `No monster name specified`);
      return;
    }
    AccessData.get(url)
      .then( (data) => {

        if(data.count == 0) { // Si pas de monstre trouvé
          this.msg(message).sendError(`Le monstre **${MONSTER_NAME}** n'existe pas`);
          this.log(0, `The monster ${MONSTER_NAME}, doesn't exist`);
          return;
        } else if (data.count > 1){ // Si plus d'un monstre trouvé

          let SECOND_PARAM = this.message.content.split(' ')[3] // Check si le user à demendé un certain mob
          if(SECOND_PARAM && !isNaN(SECOND_PARAM) && (SECOND_PARAM-1 < data.count && SECOND_PARAM-1 > 0)) {
            this.getEmbedDataAbout(data.results[SECOND_PARAM-1].com2us_id)
              .then( (embedData) => {
                this.msg(message).sendEmbed(embedData);
                this.log(2, `Found informations about ${MONSTER_NAME} (${SECOND_PARAM})`);
              })
          } else { // Sinon affiche la liste de tous les monstres trouvés
            let listMonster = [];
            data.results.forEach( (monster) => { listMonster.push(`**${monster.name}**`); });
            this.msg(message).sendEmbed({
              'author_name' : message.member.nickname,
              'author_avatar' : message.author.avatarURL,
              'description': `Il existe plusieurs monstres commencant par \`${MONSTER_NAME}\` :
                ${listMonster.join(', ')}`
            })
            this.log(2, `Found informations about multiple monster (${data.count})`)
          }

        } else { // Si un seul monstre trouvé
          this.getEmbedDataAbout(data.results[0].com2us_id)
            .then( (embedData) => {
              this.msg(message).sendEmbed(embedData);
              this.log(2, `Found informations about ${MONSTER_NAME}`);
            })
        }
      })
      .catch( (err, _res, _body) => {

        this.msg(message).sendError(`Erreur lors de l'accès aux données veuillez contacter un administrateur ou réessayer plus tard.`)
        this.log(0, `ERROR while trying to get information on web site ${url}`, err);
      });
  }

  static async getEmbedDataAbout(mobId) {
    let url = `${SW_BESTIARY_API_URL}?com2us_id=${mobId}&format=json`;
    return new Promise ( (resolve) => {
      AccessData.get(url)
        .then( (data) => {
          data = data[0]
          let leaderData;
          let stars = ":star:".repeat(data.natural_stars);

          if(data.leader_skill != undefined){
            leaderData = `Increase the ${data.leader_skill.attribute} of ally monster`;
            if(data.leader_skill.element != null ) leaderData = `${leaderData} with ${data.leader_skill.element} attribute`;
            if(data.leader_skill.area != "Element") leaderData = `${leaderData} in the ${data.leader_skill.area}`;
            leaderData = `${leaderData} by ${data.leader_skill.amount}%`;
          }

          const MOB_IMG_ICO = `https://swarfarm.com/static/herders/images/monsters/${data.image_filename}`;
          let fieldArray = [
            { 'name' : "Name", 'value' : data.name, 'inline' : true },
            { 'name' : "Natural Stars", 'value' : stars, 'inline' : true }
          ];
          if(leaderData != undefined){
            fieldArray.push({ 'name' : "Leader skill", 'value' : `${leaderData}\n** **`, });
          }

          data.skills.forEach((skill) => {
            fieldArray.push({
              'name' : skill.name,
              'value' : skill.description
            });
          });

          return resolve({
            'author_name': this.message.member.nickname,
            'author_avatar': this.message.author.avatarURL,
            'description': `\n** **`,
            'thumbnail': MOB_IMG_ICO,
            'fields': fieldArray,
          });
        })
        .catch( (err, _res, _body) => {
          this.msg(this.message).sendError(`Erreur lors de l'accès aux données veuillez contacter un administrateur ou réessayer plus tard.`)
          this.log(0, `ERROR while trying to get more info for monster on web site ${url}`, err);
        })
    })
  }

}

module.exports = MobsInfos;

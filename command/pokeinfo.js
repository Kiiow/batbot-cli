const adminFunc = require('../function/adminFunc.js');
const msgFunc = require('../function/msgFunc.js');

class Pokeinfo {

  /**
   * Affiche les informations d'un pokémon
   * @param  {[Discord.message]} message [message discord à traiter]
   */
  static pokeInfo(message){
    message.delete();
    let msgArray = message.content.split(" ");
    msgArray.splice(0,1);
    let pokename = msgArray.join(' ');
    // console.log(pokename);
    let thiss = this;
    adminFunc.getJSONData('pokedex', function(err, JSONObj){
      let id = 0, pokemon = {}, found = false;
      while(id < 809 && found == false){
        pokemon = JSONObj[id];
        if(pokemon.name.english.toLowerCase() == pokename.toLowerCase()){
          thiss.sendInfo(pokemon, message);
          found = true;
        }else if(pokemon.name.francais.toLowerCase() == pokename.toLowerCase()){
          thiss.sendInfo(pokemon, message);
          found = true;
        }else if(pokemon.id == 809 && !found){
          msgFunc.sendError(message, "Le pokémon " + pokename + " n'a pas été trouvé");
        }
        id ++;
      }
    });
  }

  /**
   * Affiche les stats d'un pokémon
   * @param  {[Discord.message]} message [message discord à traiter]
   */
  static pokeStats(message){
    message.delete();
    let pokename = (message.content.split(" "))[1];
    // console.log(pokename);
    let thiss = this;
    adminFunc.getJSONData('pokedex', function(err, JSONObj){
      let id = 0, pokemon = {}, found = false;
      while(id < 809 && found == false){
        pokemon = JSONObj[id];
        if(pokemon.name.english.toLowerCase() == pokename.toLowerCase()){
          thiss.sendStats(pokemon, message);
          found = true;
        }else if(pokemon.name.francais.toLowerCase() == pokename.toLowerCase()){
          thiss.sendStats(pokemon, message);
          found = true;
        }else if(pokemon.id == 809 && !found){
          msgFunc.sendError(message, "Le pokémon " + pokename + " n'a pas été trouvé");
        }
        id ++;
      }
    });
  }

  /**
   * Envoie le message sur les stats du pkmn
   * @param  {[JSONObject]} pokemon [Object JSON du pokemon]
   * @param  {[Discord.message]} message [message discord à traiter]
   */
  static sendStats(pokemon, message){
    let msgArray = message.content.split(" ");
    msgArray.splice(0,1);
    let pokename = msgArray.join(' ');
    let pokemonId = "00" + pokemon.id;
    pokemonId = pokemonId.substring(pokemonId.length-3, pokemonId.length);
    let pkn = this.formatePkmnName(pokemon, "url2");
    let urlImg = "https://play.pokemonshowdown.com/sprites/xydex/" + pkn + ".png";
    let urlGif = "https://play.pokemonshowdown.com/sprites/xyani/" + pkn + ".gif";
    msgFunc.sendEmbed(message, {
      color : this.typeToColor(pokemon.type[0]),
      author_name : msgFunc.firstLetterCaps(pokename),
      author_avatar : urlImg,
      thumbnail: urlGif,
      description : "** **",
      fields : [
        {
          name: "__Stats__",
          value: "**Hp** : " + pokemon.base.HP +
                 "\n**Atk** : " + pokemon.base.Attack +
                 "\n**Def** : " + pokemon.base.Defense +
                 "\n**Sp. Atk** : " + pokemon.base["Sp. Attack"] +
                 "\n**Sp. Def** : " + pokemon.base["Sp. Defense"] +
                 "\n**Vit** : " + pokemon.base.Speed ,
          inline: true
        }
      ],
      footer : "pixelmon-information",
    });
  }

  /**
   * Envoie le message d'information sur le pkmn
   * @param  {[JSONObject]} pokemon [Object JSON du pokemon]
   * @param  {[Discord.message]} message [message discord à traiter]
   */
  static sendInfo(pokemon, message){
    let msgArray = message.content.split(" ");
    msgArray.splice(0,1);
    let pokename = msgArray.join(' ');
    let pokemonId = "00" + pokemon.id;
    pokemonId = pokemonId.substring(pokemonId.length-3, pokemonId.length);
    let pkn = this.formatePkmnName(pokemon, "url2");
    let urlImg = "https://play.pokemonshowdown.com/sprites/xydex/" + pkn + ".png";
    let urlGif = "https://play.pokemonshowdown.com/sprites/xyani/" + pkn + ".gif";
    let dropList = [];
    pokemon.drops.forEach(function(drop){
      dropList.push(drop.nom);
    });
    msgFunc.sendEmbed(message, {
      color : this.typeToColor(pokemon.type[0]),
      author_name : msgFunc.firstLetterCaps(pokename),
      author_avatar : urlImg,
      thumbnail: urlGif,
      description : "** **",
      fields : [
        {
          name: "N° Pokedex - " + pokemonId,
          value: "Fr : " + pokemon.name.francais + "\nEn : " + pokemon.name.english,
          inline: true
        },
        {
          name: "Type",
          value: pokemon.type.join(', '),
          inline: true
        },
        {
          name: "Egg group",
          value: pokemon.egg_group.join(', '),
          inline: true
        },
        {
          name: "Genre",
          value: "Male : " + pokemon.gender.male + "\nFemelle : " + pokemon.gender.female,
          inline: true
        },
        {
          name: "Drops : ",
          value: dropList.join(', ') + "\n**  **"
        },
        {
          name: "\nLiens",
          value: "- [Pokestrat](https://pokestrat.io/fiche-pokemon/" + this.formatePkmnName(pokemon, "strat") + ")" +
                 "\n- [PixelmonWiki](https://pixelmonmod.com/wiki/index.php?title=" + this.formatePkmnName(pokemon, "pixelmon") + ")"
        }
      ],
      footer : "pixelmon-information",
    });
  }

  /**
   * Formate le nom du pokémon en fonction de ce qui est nécessaire pour un lien
   * @param  {[JSONObject]} pokemon [Object JSON du pkmn]
   * @param  {[String]} type    [Format du string à sortir]
   * @return {[String]}         [nom du pkmn formaté]
   */
   static formatePkmnName(pokemon, type){
     let pkmnName = pokemon.name.francais.toLowerCase();
     switch(type){
       case "strat":
         pkmnName = pkmnName.replace('Mr. Mime', 'mr-mime');
         pkmnName = pkmnName.replace('Mime Jr.', 'mime-jr');
         pkmnName = pkmnName.replace(/é/gi, 'e');
         pkmnName = pkmnName.replace(/♂/gi, '-m');
         pkmnName = pkmnName.replace(/♀/gi, '-m');
         pkmnName = pkmnName.replace(/: | |.|'/gi, '-');
         break;
       case "pixelmon":
         pkmnName = pkmnName.replace(/ /gi, '_');
         break;
       case "url":
         pkmnName = pokemon.name.english;
         pkmnName = pkmnName.replace(/: | /gi, '_');
         pkmnName = pkmnName.replace(/é/gi, 'e');
         break;
       case "url2":
         pkmnName = pokemon.name.english.toLowerCase();
         pkmnName = pkmnName.replace(/: |\.| /gi, '');
         pkmnName = pkmnName.replace(/é/gi, 'e');
         break;
     }
     return pkmnName;
   }

  /**
   * Retourne une couleur en fonction du type donné
   * @param  {[String]} type [type du pkmn]
   * @return {[int]}      [couleur en décimal]
   */
  static typeToColor(type){
    let typeColor = {
      normal : 11184793,
      fire: 16729122,
      water: 3381759,
      electric: 16763955,
      grass: 7851093,
      ic: 6737151,
      fightning: 12277060,
      poison: 11163033,
      ground: 14531413,
      flying: 8952319,
      psychic: 16733593,
      bug: 11189026,
      rock: 12298854,
      ghost: 6710971,
      dragon: 7825134,
      dark: 7820612,
      steel: 11184827,
      fairy: 15636974
    };
    return typeColor[type.toLowerCase()];
  }

}

module.exports = Pokeinfo

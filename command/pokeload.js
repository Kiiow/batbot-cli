const fs = require('fs');
const cheerio = require('cheerio')
const msgFunc = require('../function/msgFunc.js');
const adminFunc = require('../function/adminFunc.js');

class Pokeload{

  /**
   * Charge toutes les informations nécessaires dans le JSON
   * @param  {[Discord.message]} message [message discord]
   */
  static pokeLoad(message){
    message.delete();
    message.channel.send('pokeload');
    let thiss = this;
    adminFunc.getJSONData('pokedex', function(err, JSONObj){
      JSONObj.forEach(function(pokemon){
        // charge les données d'egg_group, nomFr, gender
        if(pokemon.name.francais == undefined || pokemon.name.francais == ""){
          console.log("-----> " + pokemon.name.english);
          thiss.loadPkmnPage(pokemon.name.english, pokemon, JSONObj);
        }
        // charge les données de spawn et drops (pixelmon data)
        if(pokemon.drops == undefined){
          console.log("-----> " + pokemon.name.francais);
          thiss.loadPixelmonPage(pokemon.name.english, pokemon, JSONObj);
        }
      });
    });
  }

  /**
   * Charge la page du pkmn en anglais
   * @param  {[String]} PkmnName [Nom du pkmn en anglais]
   * @param  {[JSONObject]} pokemon  [Object jSON du pokemon]
   * @param  {[JSONObject]} pokedex  [Object JSON du pokedex]
   */
  static loadPkmnPage(PkmnName, pokemon, pokedex){
    PkmnName = PkmnName.replace('Mr. Mime', 'mr-mime');
    PkmnName = PkmnName.replace('Mime Jr.', 'mime-jr');
    PkmnName = PkmnName.replace(/é/gi, 'e');
    PkmnName = PkmnName.replace(/♂/gi, '-m');
    PkmnName = PkmnName.replace(/♀/gi, '-m');
    PkmnName = PkmnName.replace(/: | |.|'/gi, '-');
    let url = 'https://pokemondb.net/pokedex/' + PkmnName.toLowerCase();
    // console.log(url);
    let thiss = this;

    adminFunc.ajaxRequest(url, function(err, content){
      let pokeFrName = thiss.getPokeFrName(content);
      if(pokeFrName == "")pokeFrName == pokemon.name.english;

      // on modifie les infos de l'objet JSON
      pokemon.egg_group = thiss.getEggGroup(content);
      pokemon.gender = thiss.getGender(content);
      pokemon.name.francais = pokeFrName;
      // on implémente le pkmn dans le JSON pokedex
      pokedex[(pokemon.id - 1)] = pokemon;
      // On écrit les modifications
      fs.writeFileSync(
        './JSONFiles/pokedex.json',
        JSON.stringify(pokedex, null, '\t'),
        'utf8',
        function(err, data){
            if(err) console.error(err);
        }
      );

    });
  }

  /**
   * Charge la page du pkmn en anglais (pixelmon data)
   * @param  {[String]} PkmnName [Nom du pkmn en anglais]
   * @param  {[JSONObject]} pokemon  [Object jSON du pokemon]
   * @param  {[JSONObject]} pokedex  [Object JSON du pokedex]
   */
  static loadPixelmonPage(PkmnName, pokemon, pokedex){
    PkmnName = PkmnName.replace(/ /gi, '_');
    let url = "https://pixelmonmod.com/wiki/index.php?title=" + PkmnName;
    console.log(url);
    let thiss = this;

    adminFunc.ajaxRequest(url, function(err, content){
      let drops = thiss.getDrops(content);
      let spawns = thiss.getSpawn(content);
      pokemon.drops = drops;
      pokemon.spawns = spawns;
      pokedex[(pokemon.id - 1)] = pokemon;
      fs.writeFileSync(
        './JSONFiles/pokedex.json',
        JSON.stringify(pokedex, null, '\t'),
        'utf8',
        function(err, data){
            if(err) console.error(err);
        }
      );
    });
  }

  /**
   * Retourne les endroits ou spawn le pokémon (dans pixelmon)
   * @param  {[String]} content [Contenu de la page du pkmn en anglais]
   * @return {[Array]}         [Tableau des spawns (JSON Object)]
   */
  static getSpawn(content){
    let $ = cheerio.load(content);
    let txt = $('#Spawn_Biomes').parent().next().children().text();
    txt = txt.replace(/\n\n\n\nThis Pokemon can spawn naturally or forced if the above conditions are met\n/gi, '');
    txt = txt.replace(/\n Biome|\n Time|\n Location|\n Condition|\n Rarity|\n\n\n\n/gi, '');
    txt = txt.replace(/    \n\n\n/gi, '');
    let items = adminFunc.removeItemByString(txt.split('\n'), '');
    let spawn = [];
    let rarity;
    for(let i =0; i < items.length;){
      if(items[i+4] != undefined){
        rarity = (items[i+4]).substr(1);
      }else{
        rarity = items[i+4];
      }
      spawn.push({
        biome: items[i],
        time: items[i+1],
        location: items[i+2],
        condition: items[i+3],
        rarity: rarity,
      });
      i +=5;
    }
    // console.log(spawn);
    return spawn;
  }

  /**
   * Retourne les drops possible du pokémon
   * @param  {[String]} content [Contenu de la page du pkmn en anglais]
   * @return {[Array]}         [Tableau des drops (JSON Object)]
   */
  static getDrops(content){
    let $ = cheerio.load(content);
    let txt = $('#Drops').parent().next().children().text();
    let x = txt.search("<img");
    let y = txt.search('/>') + 2;
    let suppr = "";
    while(x != -1){
      suppr = txt.slice(x, y);
      txt = txt.replace(suppr, '');
      x = txt.search("<img");
      y = txt.search('/>') + 2;
    }
    // txt = txt.replace(/\n/gi, '');
    txt = txt.replace(/\n Drop\n\n Chance\n\n Quantity\n\n\n\n\n|%/gi, '');
    let items = adminFunc.removeItemByString(txt.split('\n'), '');
    let drops = [];
    for(var i = 0; i < items.length;){
      drops.push({
        nom: items[i],
        chance: items[i+1],
        quantite: items[i+2]
      });
      i += 3;
    }
    // console.log(drops);
    return drops;
  }

  /**
   * Retourne à quel groupe d'oeuf appartient le pkmn
   * @param  {[String]} content [Contenu de la page du pkmn en anglais]
   * @return {[Array]}         [Tableau du/des groupe(s) d'oeuf(s)]
   */
  static getEggGroup(content){
    let x = content.search("Egg Groups");
    let y = content.search("Gender");
    let regexp = /<td>| <\/td>|<\/tr>|<tr>|<th>|<\/th>|<\/a>|Egg Groups|<a href="\/egg-group\/([a-z]*|[a-z]*-[0-9]*|[a-z]*-[a-z]*)">|\n/gi;
    let egg_group = content.substring(x, y).replace(regexp, '');
    egg_group = egg_group.split(', ')
    // console.log(egg_group);
    return egg_group;
  }

  /**
   * Retourne le pourcentage de femelle/male du pkmn
   * @param  {[String]} content [Contenu de la page du pkmn en anglais]
   * @return {[JSONObject]}         [Object JSON avec le pourcentage de femelle/male]
   */
  static getGender(content){
    let $ = cheerio.load(content);
    let txt = $('tr', '.vitals-table').text();
    let x = txt.search('Gender') + 7;
    let y = txt.search('Egg cycles') - 2;
    let gender = txt.substring(x, y);
    let regexp = /%| male| female/gi;
    gender = gender.replace(regexp , '');
    gender = gender.split(', ');
    if(gender.length < 2 ){
      gender[0] = 0;
      gender[1] = 0
    }
    // console.log(gender);
    return { male : gender[0], female: gender[1]};
  }

  /**
   * Récupère le nom en français du pokemon
   * @param  {[String]} content [Contenu de la page du pkmn en anglais]
   * @return {[String]}         [Nom du pkmn]
   */
  static getPokeFrName(content){
    let $ = cheerio.load(content);
    let txt = $('tr', '.vitals-table').text();
    let french = txt.substring(txt.search('French') + 7, txt.length - 1);
    if(french.length >25)french = "";
    // console.log(french);
    return french;
  }
}
module.exports = Pokeload;

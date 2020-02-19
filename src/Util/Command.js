

class Command {

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.filename = data.filename;
    this.active = data.active || false;
    this.category = {
      'id': data.category.id,
      'libelle': data.category.libelle,
    }
    this.help_data = {
      'id': data.helpData.id,
      'icon': data.helpData.icon,
      'example': data.helpData.example,
      'text_EN': data.helpData.text_EN,
      'text_FR': data.helpData.text_FR,
    }
  }

}


module.exports = Command;

const FileSys = require('fs-extra');
const CONFIG = require('../Config');

/**
 * Class AccessData
 */
class AccessData {

  /**
   * Read a jsonFile
   * @param {String} filename Name of the file in ./src/DataFiles/JSON/
   *
   * @return {Promise<JSON, String>} Promise
   * @resolve {JSONObj, FILE_PATH} Object found in the file, and full path to the file
   * @reject {Error}
   */
  static ReadJSONFile(filename) {
    const FILE_PATH = CONFIG.PROJECT_PATH + 'src/DataFiles/JSON/' + filename + '.JSON';

    return new Promise ( (resolve, reject) => {
      FileSys.readFile(FILE_PATH, (error, content) => {
        if(error) {
          reject(error);
        } else {
          let JSONObj = JSON.parse(content)
          resolve(JSONObj, FILE_PATH);
        }
      });
    });
  }

}

module.exports = AccessData;

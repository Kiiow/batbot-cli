const FileSys = require('fs-extra');
const CONFIG = require('../Config');
const request = require('request');


/**
 * Class AccessData
 */
class AccessData {

  /**
   * Read a jsonFile
   * @param {String}  filename        Name of the file in "./src/DataFiles/JSON/"
   * @return {Promise<JSON, String>}  Object found in the file, and full path to the file
   */
  static readJSONFile(filename) {
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

  /**
   * Execute a get request on a web page
   * @param  {String} url Url of the page to request
   * @return {Promise}    Result of the request
   */
  static async getDataFromWeb(url) {
    return new Promise( (resolve, reject) => {
      request.get(url, {json: true}, (err, res, body) => {
        if(err != null || res.statusCode != 200) {
          return reject(err, res, body);
        } else {
          return resolve(res, body);
        }
      });
    });
  }

}

module.exports = AccessData;

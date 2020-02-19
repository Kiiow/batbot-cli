const FileSys = require('fs-extra');
const CONFIG = require('../Config');
const request = require('request');
const fetch = require('node-fetch');


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
   * @param  {String} url       Url of the page to request
   * @param  {JSON}  [url = {}] Header of the request
   * @return {Promise}          Result of the request
   */
  static async get(url, header = {}) {
    return new Promise( (resolve, reject) => {
      try {
        fetch(url, header)
          .then(res => {
            return res.json();
          })
          .then(data => { return resolve(data) })
          .catch(err => { return reject(err) })
      }catch(error) {
        return reject(error)
      }

    });
  }

  static async post(url, body) {
    let options = {
      'method': 'POST',
      'body': body
    }
    return new Promise( (resolve, reject) => {
      try {
        fetch(url, options)
          .then( data => {
            return resolve(data)
          })
          .catch( err => { return reject(err) })
      } catch(error) {
        return reject(error)
      }
    })
  }

}

module.exports = AccessData;

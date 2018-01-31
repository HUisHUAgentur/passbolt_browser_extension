/**
 * File controller.
 *
 * @copyright (c) 2017 Passbolt SARL
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
var Worker = require('../model/worker');

/**
 * Save file on disk using download
 *
 * @param filename
 * @param content
 * @param tabid
 * @return {Promise}
 */
function saveFile(filename, content, tabid) {
  return new Promise(function(resolve, reject) {
    var fileWorker = Worker.get('FileIframe', tabid);
    fileWorker.port.emit('passbolt.file-iframe.download', filename, content);
    resolve();
  });
}
exports.saveFile = saveFile;

/**
 * Load the content of a file
 * @param path {string} Path of the file to load in the addon context
 * @return {Promise}
 */
function loadFile (path) {
  return new Promise(function(resolve, reject) {
    var url = chrome.runtime.getURL(path);
    fetch(url).then(
      function (response) {resolve(response.text());},
      function (error) {reject(error);}
    );
  });
}
exports.loadFile = loadFile;

/**
 * Transforms a base 64 encoded file content into a file object.
 * Useful when we need to transmit a file from the content code to the add-on code.
 * @param string b64Data
 * @param string contentType
 * @param integer sliceSize
 * @returns {*}
 */
function b64ToBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
exports.b64ToBlob = b64ToBlob;
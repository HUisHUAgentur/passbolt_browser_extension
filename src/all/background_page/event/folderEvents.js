/**
 * Folder events
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const {FolderEntity} = require('../model/entity/folder/folderEntity');
const {FolderModel} = require('../model/folderModel');
const {FolderMoveController} = require('../controller/folder/folderMoveController');
const {User} = require('../model/user');

const listen = function (worker) {

  // ================================
  // SERVICE ACTIONS
  // ================================

  /*
   * Validate a folder
   *
   * @listens passbolt.folders.validate
   * @param requestId {uuid} The request identifier
   * @param folder {array} The folder
   */
  worker.port.on('passbolt.folders.validate', async function (requestId, folderDto) {
    try {
      worker.port.emit(requestId, 'SUCCESS', new FolderEntity(folderDto));
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', worker.port.getEmitableError(error));
    }
  });

  /*
   * Create a new folder
   *
   * @listens passbolt.folders.create
   * @param requestId {uuid} The request identifier
   * @param folder {array} The folder
   */
  worker.port.on('passbolt.folders.create', async function (requestId, folderDto) {
    try {
      let folderModel = new FolderModel(await User.getInstance().getApiClientOptions());
      let folderEntity = await folderModel.create(new FolderEntity(folderDto));
      worker.port.emit(requestId, 'SUCCESS', folderEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', worker.port.getEmitableError(error));
    }
  });

  /*
   * Update a folder
   *
   * @listens passbolt.folders.update
   * @param requestId {uuid} The request identifier
   * @param folder {array} The folder
   */
  worker.port.on('passbolt.folders.update', async function (requestId, folderDto) {
    try {
      let folderModel = new FolderModel(await User.getInstance().getApiClientOptions());
      let folderEntity = await folderModel.update(new FolderEntity(folderDto));
      worker.port.emit(requestId, 'SUCCESS', folderEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', worker.port.getEmitableError(error));
    }
  });

  /*
   * Move content into folder.
   *
   * @listens passbolt.folders.update
   * @param requestId {uuid} The request identifier
   * @param moveDto {object} The move data
   * {
   *   resources: {array} The resources ids to move
   *   folders: {array} The folders ids to move
   *   folderParentId: {string} The destination folder
   * }
   */
  worker.port.on('passbolt.folders.bulk-move', async function (requestId, moveDto) {
    const controller = new FolderMoveController(worker, requestId);
    try {
      await controller.main(moveDto);
      worker.port.emit(requestId, 'SUCCESS');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        worker.port.emit(requestId, 'ERROR', worker.port.getEmitableError(error));
      } else {
        worker.port.emit(requestId, 'ERROR', error);
      }
    }
  });

  /*
   * delete a folder
   *
   * @listens passbolt.folders.delete
   * @param requestId {uuid} The request identifier
   * @param folder {array} The folder
   */
  worker.port.on('passbolt.folders.delete', async function (requestId, folderId, cascade) {
    try {
      let folderModel = new FolderModel(await User.getInstance().getApiClientOptions());
      await folderModel.delete(folderId, cascade);
      folderModel.updateLocalStorage();
      worker.port.emit(requestId, 'SUCCESS', folderId);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', worker.port.getEmitableError(error));
    }
  });

};

exports.listen = listen;

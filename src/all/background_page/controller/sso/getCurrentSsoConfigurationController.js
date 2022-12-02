
/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.9.0
 */
import SsoConfigurationModel from "../../model/sso/ssoConfigurationModel";

class GetCurrentSsoConfigurationController {
  /**
   * GetCurrentSsoConfigurationController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.ssoConfigurationModel = new SsoConfigurationModel(apiClientOptions);
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @param {uuid} draftSsoConfigurationId the draft sso configuration id
   * @return {Promise<void>}
   */
  async _exec() {
    try {
      const ssoConfiguration = await this.exec();
      this.worker.port.emit(this.requestId, "SUCCESS", ssoConfiguration);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Returns the current active SSO configuration registered from the API.
   *
   * @return {Promise<SsoConfigurationEntity>}
   */
  async exec() {
    const contains = {data: true};
    const ssoConfigurationEntity = await this.ssoConfigurationModel.getCurrent(contains);
    return ssoConfigurationEntity;
  }
}

export default GetCurrentSsoConfigurationController;

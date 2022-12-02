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
import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import DecryptPrivateKeyService from "../../service/crypto/decryptPrivateKeyService";

class CheckPassphraseService {
  /**
   * CheckPassphraseService constructor
   * @todo multi-account to replace by verifyAccountPassphraseController.
   *
   * @param {Worker} worker
   * @param {string} requestId uuid
   */
  constructor(keyring) {
    this.keyring = keyring;
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @param {string} passphrase The passphrase with which to try the current user's key decryption.
   * @returns {Promise<void>}
   */
  async checkPassphrase(passphrase) {
    const privateKey = this.keyring.findPrivate();
    if (!privateKey) {
      throw new Error('Private key not found.');
    }
    const key = await OpenpgpAssertion.readKeyOrFail(privateKey.armoredKey);
    await DecryptPrivateKeyService.decrypt(key, passphrase);
  }
}

export default CheckPassphraseService;

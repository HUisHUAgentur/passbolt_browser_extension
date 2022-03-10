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
 * @since         3.6.0
 */

import {enableFetchMocks} from "jest-fetch-mock";
import {v4 as uuidv4} from "uuid";
import {mockApiResponse} from "../../../tests/mocks/mockApiResponse";
import {defaultApiClientOptions} from "../../service/api/apiClient/apiClientOptions.test.data";
import {AccountRecoveryGetUserRequestsController} from "./accountRecoveryGetUserRequestsController";
import {defaultAccountRecoveryRequestDto} from "../../model/entity/accountRecovery/accountRecoveryRequestEntity.test.data";

beforeEach(() => {
  enableFetchMocks();
});

describe("AccountRecoveryGetUserRequestsController", () => {
  describe("AccountRecoveryGetUserRequestsController::exec", () => {
    it("Should retrieve the account recovery organization policy.", async() => {
      // Mock API fetch account recovery requests response.
      const userId = uuidv4();
      const mockApiResult = [
        defaultAccountRecoveryRequestDto({user_id: userId}),
        defaultAccountRecoveryRequestDto({user_id: userId})
      ];
      fetch.doMock(() => mockApiResponse(mockApiResult));

      const controller = new AccountRecoveryGetUserRequestsController(null, null, defaultApiClientOptions());
      const accountRecoveryRequests = await controller.exec(userId);

      expect.assertions(2);
      const items = accountRecoveryRequests.items;
      expect(items).toHaveLength(2);
      const accountRecoveryOrganizationPolicyDto = accountRecoveryRequests.toDto();
      expect(accountRecoveryOrganizationPolicyDto).toEqual(mockApiResult);
    });

    it("Should return an empty collection if the users has no account recovery requests.", async() => {
      // Mock API fetch account recovery requests response.
      const userId = uuidv4();
      const mockApiResult = [];
      fetch.doMock(() => mockApiResponse(mockApiResult));

      const controller = new AccountRecoveryGetUserRequestsController(null, null, defaultApiClientOptions());
      const accountRecoveryRequests = await controller.exec(userId);

      expect.assertions(1);
      const items = accountRecoveryRequests.items;
      expect(items).toHaveLength(0);
    });

    it("Should throw an error if the provider user id is not valid.", async() => {
      const userId = "invalid uuid";

      const controller = new AccountRecoveryGetUserRequestsController(null, null, defaultApiClientOptions());
      const result = controller.exec(userId);

      expect.assertions(1);
      expect(result).rejects.toThrowError("The user id is not valid");
    });
  });
});
import { ClientConfig } from "./types.ts";
import { baseClient } from "./base_client.ts";
import { proxifyFactory } from "./api_proxy.ts";

import { authRequestFactory } from "./apis/auth.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { loginRequestFactory } from "./apis/login.ts";
import { orderManagementRequestFactory } from "./apis/ordermanagement.ts";
import {
  callbackQRRequestFactory,
  redirectQRRequestFactory,
} from "./apis/qr.ts";
import {
  agreementRequestFactory,
  chargeRequestFactory,
} from "./apis/recurring.ts";
import { userRequestFactory } from "./apis/user.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";

// Export all API types, for convenience.
export type * from "./apis/types/all_external_types.ts";

/**
 * Creates a new SDK client.
 *
 * @param options - The client configuration options.
 * @returns {object} The SDK client with proxified API request factories.
 */
export const Client = (options: ClientConfig) => {
  // Create the base client
  const client = baseClient(options);

  // Create the API client
  return {
    auth: proxifyFactory(client, authRequestFactory),
    checkout: proxifyFactory(client, checkoutRequestFactory),
    login: proxifyFactory(client, loginRequestFactory),
    order: proxifyFactory(client, orderManagementRequestFactory),
    payment: proxifyFactory(client, ePaymentRequestFactory),
    qr: {
      callback: proxifyFactory(client, callbackQRRequestFactory),
      redirect: proxifyFactory(client, redirectQRRequestFactory),
    },
    recurring: {
      charge: proxifyFactory(client, chargeRequestFactory),
      agreement: proxifyFactory(client, agreementRequestFactory),
    },
    user: proxifyFactory(client, userRequestFactory),
    webhook: proxifyFactory(client, webhooksRequestFactory),
  } as const;
};

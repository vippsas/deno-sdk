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

/**
 * Export all API types, for convenience. All exported types are
 * prefixed with the API name, to avoid potential naming conflicts.
 */
export type * from "./apis/types/auth_types.ts";
export type * from "./apis/types/checkout_types.ts";
export type * from "./apis/types/epayment_types.ts";
export type * from "./apis/types/login_types.ts";
export type * from "./apis/types/ordermanagement_types.ts";
export type * from "./apis/types/qr_types.ts";
export type * from "./apis/types/recurring_types.ts";
export type * from "./apis/types/user_types.ts";
export type * from "./apis/types/webhooks_types.ts";

/**
 * Creates a new SDK client.
 *
 * @param options - The client configuration options.
 */
export const Client = (options: ClientConfig) => {
  // Create the base client
  const client = baseClient(options);

  // Create the API client
  const apiClient = {
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

  return apiClient;
};

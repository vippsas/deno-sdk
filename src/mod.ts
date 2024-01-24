import { ClientConfig } from "./types.ts";
import { baseClient } from "./base_client.ts";
import { ApiClient, createApi } from "./api_proxy.ts";
import { authRequestFactory } from "./apis/auth.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";
import { agreementRequestFactory } from "./apis/recurring.ts";
import { chargeRequestFactory } from "./apis/recurring.ts";
import {
  callbackQRRequestFactory,
  redirectQRRequestFactory,
} from "./apis/qr.ts";
import { loginRequestFactory } from "./apis/login.ts";
import { orderManagementRequestFactory } from "./apis/ordermanagement.ts";

/**
 * Export all API types, for convenience. All exported types are
 * prefixed with the API name, to avoid potential naming conflicts.
 */
export type * from "./apis/types/auth_types.ts";
export type * from "./apis/types/checkout_types.ts";
export type * from "./apis/types/epayment_types.ts";
export type * from "./apis/types/login_types.ts";
export type * from "./apis/types/qr_types.ts";
export type * from "./apis/types/recurring_types.ts";
export type * from "./apis/types/webhooks_types.ts";
export type * from "./apis/types/ordermanagement_types.ts";

/**
 * Creates a client with the specified options.
 * @param options The client configuration options.
 * @returns The API client.
 */
export const Client = (options: ClientConfig) => {
  // Create the base client
  const client = baseClient(options);

  // Create the API client
  const apiClient = {
    auth: createApi(client, authRequestFactory),
    callbackQR: createApi(client, callbackQRRequestFactory),
    checkout: createApi(client, checkoutRequestFactory),
    login: createApi(client, loginRequestFactory),
    payment: createApi(client, ePaymentRequestFactory),
    recurring: {
      charge: createApi(client, chargeRequestFactory),
      agreement: createApi(client, agreementRequestFactory),
    },
    redirectQR: createApi(client, redirectQRRequestFactory),
    webhook: createApi(client, webhooksRequestFactory),
    orderManagement: createApi(client, orderManagementRequestFactory),
  } satisfies ApiClient;

  return apiClient;
};

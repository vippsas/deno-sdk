import { ClientConfig } from "./types.ts";
import { baseClient } from "./base_client.ts";
import { APIClient, createApi } from "./api_proxy.ts";
import { authRequestFactory } from "./apis/auth.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";
import { agreementRequestFactory } from "./apis/recurring.ts";
import { chargeRequestFactory } from "./apis/recurring.ts";
import {
  callbackQRRequestFactory,
  dynamicQRRequestFactory,
  redirectQRRequestFactory,
} from "./apis/qr.ts";

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
    agreement: createApi(client, agreementRequestFactory),
    callbackQR: createApi(client, callbackQRRequestFactory),
    charge: createApi(client, chargeRequestFactory),
    checkout: createApi(client, checkoutRequestFactory),
    payment: createApi(client, ePaymentRequestFactory),
    dynamicQR: createApi(client, dynamicQRRequestFactory),
    redirectQR: createApi(client, redirectQRRequestFactory),
    webhook: createApi(client, webhooksRequestFactory),
  } satisfies APIClient;

  return apiClient;
};

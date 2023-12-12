import { ClientConfig } from "./types.ts";
import { baseClient } from "./base_client.ts";
import { APIClient, createApi } from "./api_proxy.ts";
import { authRequestFactory } from "./apis/auth.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";

export const Client = (options: ClientConfig) => {
  // Create the base client
  const client = baseClient(options);

  // Create the API client
  const apiClient = {
    auth: createApi(client, authRequestFactory),
    payment: createApi(client, ePaymentRequestFactory),
    webhook: createApi(client, webhooksRequestFactory),
    checkout: createApi(client, checkoutRequestFactory),
  } satisfies APIClient;

  return apiClient;
};

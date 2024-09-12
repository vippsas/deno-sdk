import { uuid } from "../deps.ts";
import type { RequestData } from "../types.ts";
import type {
  CheckoutProblemDetails,
  InitiatePaymentSessionRequest,
  InitiateSessionResponse,
  InitiateSubscriptionSessionRequest,
  SessionResponse,
} from "./external_types.ts";

/**
 * Factory object for creating checkout request data.
 */
export const checkoutRequestFactory = {
  /**
   * Create a checkout session within your website, where you can process
   * payments, handle shipping, and gather consent to user information.
   * See https://developer.vippsmobilepay.com/docs/APIs/checkout-api/
   * for more details.
   *
   * @param client_id - Client ID for the merchant (the "username").
   * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
   * @param client_secret - Client Secret for the merchant (the "password").
   * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
   * @param body - The request body containing the checkout session details.
   * @returns A `InitiateSessionResponse` or `CheckoutProblemDetails` object.
   */
  create: (
    client_id: string,
    client_secret: string,
    body: InitiatePaymentSessionRequest | InitiateSubscriptionSessionRequest,
  ): RequestData<InitiateSessionResponse, CheckoutProblemDetails> => {
    // Generate a reference if one is missing from the transaction
    if (body.transaction && !body.transaction.reference) {
      body.transaction.reference = uuid.generate();
    }

    // If the request is a subscription and it does not have a transaction,
    // generate a reference if one is missing
    if ("subscription" in body && !body.transaction && !body.reference) {
      body.reference = uuid.generate();
    }

    return {
      url: "/checkout/v3/session",
      method: "POST",
      body,
      additionalHeaders: {
        client_id,
        client_secret,
      },
    };
  },
  /**
   * Retrieves information about a checkout session. Transaction information,
   * user information and shipping information are included in the
   * response if the SessionState is PaymentInitiated
   *
   * @param client_id - The client ID.
   * @param client_secret - The client secret.
   * @param reference - The reference of the checkout session.
   * @returns A `SessionResponse` or `CheckoutProblemDetails` object.
   */
  info: (
    client_id: string,
    client_secret: string,
    reference: string,
  ): RequestData<SessionResponse, CheckoutProblemDetails> => {
    return {
      url: `/checkout/v3/session/${reference}`,
      method: "GET",
      additionalHeaders: {
        client_id,
        client_secret,
      },
    };
  },
};

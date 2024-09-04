import type { RequestData } from "../types.ts";
import type {
  CheckoutErrorResponse,
  CheckoutInitiateSessionOKResponse,
  CheckoutInitiateSessionRequest,
  CheckoutSessionResponse,
} from "./types/checkout_types.ts";

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
   * @returns A `CheckoutInitiateSessionOKResponse` or `CheckoutErrorResponse` object.
   */
  create: (
    client_id: string,
    client_secret: string,
    body: CheckoutInitiateSessionRequest,
  ): RequestData<CheckoutInitiateSessionOKResponse, CheckoutErrorResponse> => {
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
   * @returns A `CheckoutSessionOKResponse` or `CheckoutErrorResponse` object.
   */
  info: (
    client_id: string,
    client_secret: string,
    reference: string,
  ): RequestData<CheckoutSessionResponse, CheckoutErrorResponse> => {
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

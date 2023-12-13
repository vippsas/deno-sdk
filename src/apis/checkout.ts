import { RequestData } from "../types.ts";
import {
  CheckoutErrorResponse,
  CheckoutInitiateSessionOKResponse,
  CheckoutInitiateSessionRequest,
  GetCheckoutSessionOKResponse,
} from "./types/checkout_types.ts";

/**
 * Factory object for creating checkout request data.
 */
export const checkoutRequestFactory = {
  /**
   * Creates a new checkout session.
   * @param client_id - The client ID.
   * @param client_secret - The client secret.
   * @param body - The request body containing the checkout session details.
   * @returns A `RequestData` object with the URL, method, body, and headers for the API request.
   */
  create(
    client_id: string,
    client_secret: string,
    body: CheckoutInitiateSessionRequest,
  ): RequestData<CheckoutInitiateSessionOKResponse, CheckoutErrorResponse> {
    const newBody = { ...body };
    // Fill in missing props
    if (!body.transaction.reference) {
      newBody.transaction.reference = crypto.randomUUID();
    }
    if (!body.merchantInfo.callbackAuthorizationToken) {
      newBody.merchantInfo.callbackAuthorizationToken = crypto.randomUUID();
    }

    return {
      url: "/checkout/v3/session",
      method: "POST",
      body: newBody,
      headers: {
        client_id,
        client_secret,
      },
    };
  },
  /**
   * Retrieves information about a checkout session.
   * @param client_id - The client ID.
   * @param client_secret - The client secret.
   * @param reference - The reference of the checkout session.
   * @returns A RequestData object containing the URL, method, and headers for the API request.
   */
  info(
    client_id: string,
    client_secret: string,
    reference: string,
  ): RequestData<GetCheckoutSessionOKResponse, CheckoutErrorResponse> {
    return {
      url: `/checkout/v3/session/${reference}`,
      method: "GET",
      headers: {
        client_id,
        client_secret,
      },
    };
  },
} as const;

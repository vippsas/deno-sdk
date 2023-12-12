import { RequestData } from "../types.ts";
import {
  CheckoutErrorResponse,
  CheckoutInitiateSessionOKResponse,
  CheckoutInitiateSessionRequest,
  GetCheckoutSessionOKResponse,
} from "./types/checkout_types.ts";

export const checkoutRequestFactory = {
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

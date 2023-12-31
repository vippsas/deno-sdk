import { RequestData } from "../types.ts";
import {
  EPaymentCreatePaymentOKResponse,
  EPaymentCreatePaymentRequest,
  EpaymentErrorResponse,
  EPaymentForceApproveRequest,
  EPaymentGetPaymentOKResponse,
  EPaymentModificationOKResponse,
  EPaymentModificationRequest,
  EPaymentPaymentEventOKResponse,
} from "./types/epayment_types.ts";

/**
 * Factory object for creating ePayment API requests.
 */
export const ePaymentRequestFactory = {
  /**
   * Creates a new payment.
   *
   * @param token - The authentication token.
   * @param body - The request body containing the payment details.
   * @returns A `RequestData` object with the URL, method, body, and token.
   */
  create(
    token: string,
    body: EPaymentCreatePaymentRequest,
  ): RequestData<EPaymentCreatePaymentOKResponse, EpaymentErrorResponse> {
    const newBody = { ...body };
    // Fill in missing props
    if (!body.reference) {
      newBody.reference = crypto.randomUUID();
    }
    return {
      url: "/epayment/v1/payments",
      method: "POST",
      body: newBody,
      token,
    };
  },
  /**
   * Retrieves information about a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment.
   * @returns A `RequestData` object containing the URL, method, and token.
   */
  info(
    token: string,
    reference: string,
  ): RequestData<EPaymentGetPaymentOKResponse, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/payments/${reference}`,
      method: "GET",
      token,
    };
  },
  /**
   * Retrieves the history for a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment.
   * @returns A `RequestData` object containing the URL, method, and token for the API request.
   */
  history(
    token: string,
    reference: string,
  ): RequestData<EPaymentPaymentEventOKResponse, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/payments/${reference}/events`,
      method: "GET",
      token,
    };
  },
  /**
   * Cancels a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment to cancel.
   * @returns A RequestData object containing the URL, method, and token.
   */
  cancel(
    token: string,
    reference: string,
  ): RequestData<EPaymentModificationOKResponse, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/payments/${reference}/cancel`,
      method: "POST",
      token,
    };
  },
  /**
   * Capture a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment.
   * @param body - The modification request body.
   * @returns A request data object containing the URL, method, body, and token.
   */
  capture(
    token: string,
    reference: string,
    body: EPaymentModificationRequest,
  ): RequestData<EPaymentModificationOKResponse, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/payments/${reference}/capture`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Refunds a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment to be refunded.
   * @param body - The request body containing the modification details.
   * @returns A RequestData object with the refund request details.
   */
  refund(
    token: string,
    reference: string,
    body: EPaymentModificationRequest,
  ): RequestData<EPaymentModificationOKResponse, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/payments/${reference}/refund`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Forces the approval of a payment. Only available in the test environment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment.
   * @param body - The request body containing additional information.
   * @returns A RequestData object with void as the response data type and EpaymentErrorResponse as the error response type.
   */
  forceApprove(
    token: string,
    reference: string,
    body: EPaymentForceApproveRequest,
  ): RequestData<void, EpaymentErrorResponse> {
    return {
      url: `/epayment/v1/test/payments/${reference}/approve`,
      method: "POST",
      body,
      token,
    };
  },
} as const;

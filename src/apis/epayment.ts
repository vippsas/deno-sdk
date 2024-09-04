import { uuid } from "../deps.ts";
import type { RequestData } from "../types.ts";
import type {
  EPaymentCreatePaymentOKResponse,
  EPaymentCreatePaymentRequest,
  EPaymentErrorResponse,
  EPaymentForceApproveRequest,
  EPaymentGetEventLogOKResponse,
  EPaymentGetPaymentOKResponse,
  EPaymentModificationOKResponse,
  EPaymentModificationRequest,
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
   * @returns A `EPaymentCreatePaymentOKResponse` or `EPaymentErrorResponse` object.
   */
  create: (
    token: string,
    body: EPaymentCreatePaymentRequest,
  ): RequestData<EPaymentCreatePaymentOKResponse, EPaymentErrorResponse> => {
    const newBody = { ...body };
    // Fill in missing props
    if (!body.reference) {
      newBody.reference = uuid.generate();
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
   * @returns A `EPaymentGetPaymentOKResponse` or `EPaymentErrorResponse` object.
   */
  info: (
    token: string,
    reference: string,
  ): RequestData<EPaymentGetPaymentOKResponse, EPaymentErrorResponse> => {
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
   * @returns A `EPaymentGetEventLogOKResponse` or `EPaymentErrorResponse` object.
   */
  history: (
    token: string,
    reference: string,
  ): RequestData<EPaymentGetEventLogOKResponse, EPaymentErrorResponse> => {
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
   * @returns A `EPaymentModificationOKResponse` or `EPaymentErrorResponse` object.
   */
  cancel: (
    token: string,
    reference: string,
  ): RequestData<EPaymentModificationOKResponse, EPaymentErrorResponse> => {
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
   * @returns A `EPaymentModificationOKResponse` or `EPaymentErrorResponse` object.
   */
  capture: (
    token: string,
    reference: string,
    body: EPaymentModificationRequest,
  ): RequestData<EPaymentModificationOKResponse, EPaymentErrorResponse> => {
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
   * @returns A `EPaymentModificationOKResponse` or `EPaymentErrorResponse` object.
   */
  refund: (
    token: string,
    reference: string,
    body: EPaymentModificationRequest,
  ): RequestData<EPaymentModificationOKResponse, EPaymentErrorResponse> => {
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
   * @returns void or a `EPaymentErrorResponse` object.
   */
  forceApprove: (
    token: string,
    reference: string,
    body: EPaymentForceApproveRequest,
  ): RequestData<void, EPaymentErrorResponse> => {
    return {
      url: `/epayment/v1/test/payments/${reference}/approve`,
      method: "POST",
      body,
      token,
    };
  },
};

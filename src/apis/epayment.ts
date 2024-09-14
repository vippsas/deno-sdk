import { uuid } from "../deps.ts";
import type { RequestData } from "../types_internal.ts";
import type {
  CancelPaymentResponse,
  CaptureModificationRequest,
  CapturePaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  ForceApprove,
  ForceApproveResponse,
  GetPaymentEventLogResponse,
  GetPaymentResponse,
  Problem,
  RefundModificationRequest,
  RefundPaymentResponse,
} from "../types_external.ts";

/**
 * Factory object for creating ePayment API requests.
 */
export const ePaymentRequestFactory = {
  /**
   * Creates a new payment.
   *
   * @param token - The authentication token.
   * @param body - The request body containing the payment details.
   * @returns A `CreatePaymentResponse` or `EPaymentErrorResponse` object.
   */
  create: (
    token: string,
    body: CreatePaymentRequest,
  ): RequestData<CreatePaymentResponse, Problem> => {
    // Fill in missing props
    if (!body.reference) {
      body.reference = uuid.generate();
    }
    return {
      url: "/epayment/v1/payments",
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Retrieves information about a payment.
   *
   * @param token - The authentication token.
   * @param reference - The reference of the payment.
   * @returns A `GetPaymentResponse` or `Problem` object.
   */
  info: (
    token: string,
    reference: string,
  ): RequestData<GetPaymentResponse, Problem> => {
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
   * @returns A `GetPaymentEventLogResponse` or `EPaymentErrorResponse` object.
   */
  history: (
    token: string,
    reference: string,
  ): RequestData<GetPaymentEventLogResponse, Problem> => {
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
   * @returns A `CancelPaymentResponse` or `Problem` object.
   */
  cancel: (
    token: string,
    reference: string,
  ): RequestData<CancelPaymentResponse, Problem> => {
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
   * @returns A `CapturePaymentResponse` or `Problem` object.
   */
  capture: (
    token: string,
    reference: string,
    body: CaptureModificationRequest,
  ): RequestData<CapturePaymentResponse, Problem> => {
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
   * @returns A `RefundPaymentResponse` or `Problem` object.
   */
  refund: (
    token: string,
    reference: string,
    body: RefundModificationRequest,
  ): RequestData<RefundPaymentResponse, Problem> => {
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
   * @returns ForceApproveResponse or a `Problem` object.
   */
  forceApprove: (
    token: string,
    reference: string,
    body: ForceApprove,
  ): RequestData<ForceApproveResponse, Problem> => {
    return {
      url: `/epayment/v1/test/payments/${reference}/approve`,
      method: "POST",
      body,
      token,
    };
  },
};

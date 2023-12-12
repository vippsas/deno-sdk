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

export const ePaymentRequestFactory = {
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

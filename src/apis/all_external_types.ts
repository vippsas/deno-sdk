/**
 * Export all API types, for convenience. All exported types are
 * prefixed with the API name, to avoid naming conflicts.
 */
export type * as Auth from "./types/auth_types.ts";
export type * as Webhooks from "./generated_types/webhooks/types.gen.ts";

// Export all types from epayment
export type {
  CancelPaymentResponse,
  CaptureModificationRequest,
  CapturePaymentResponse,
  CreatePaymentResponse,
  ForceApprove,
  ForceApproveResponse,
  GetPaymentEventLogResponse,
  GetPaymentResponse,
  Problem,
  RefundModificationRequest,
  RefundPaymentResponse,
} from "./generated_types/epayment/types.gen.ts";
// Export CreatePaymentRequest from epayment, making the reference field optional
import { CreatePaymentRequest as CreatePaymentRequestInternal } from "./generated_types/epayment/types.gen.ts";
export type CreatePaymentRequest = CreatePaymentRequestInternal & {
  reference?: string;
};


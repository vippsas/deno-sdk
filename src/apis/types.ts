type MakePropertyOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]?: T[P] };

// Access Token API
export type AccessTokenError = {
  error: string;
  error_description: string;
  error_codes: number[];
  timestamp: Date;
  trace_id: string;
  correlation_id: string;
  error_uri: string;
};
export type { AuthorizationTokenResponse } from "./generated_types/access_token/types.gen.ts";

// ePayment API
import type { CreatePaymentRequest as _CreatePaymentRequest } from "./generated_types/epayment/types.gen.ts";

export type CreatePaymentRequest = MakePropertyOptional<
  _CreatePaymentRequest,
  "reference"
>;

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

// Webhooks API
export type {
  ProblemDetails,
  QueryResponse,
  RegisterRequest,
  RegisterResponse,
} from "./generated_types/webhooks/types.gen.ts";

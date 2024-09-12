// Utility that takes an existing type T and returns a new type that
// is functionally identical but potentially more readable
type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

// Create a new type with a specific key made optional
type MakePropertyOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]?: T[P] };

// Create a new type with a specific nested key made optional
type MakeNestedPropertyOptional<T, K extends keyof T, N extends keyof T[K]> = {
  [P in keyof T]: P extends K ? Omit<T[K], N> & Partial<Pick<T[K], N>> : T[P];
};

/**
 * Access Token API
 */

// The error type is missing from the spec, so we have to define it here
export type AccessTokenError = {
  error: string;
  error_description: string;
  error_codes: number[];
  timestamp: Date;
  trace_id: string;
  correlation_id: string;
  error_uri: string;
};
export type {
  AuthorizationTokenResponse,
} from "./generated_types/access_token/types.gen.ts";

/**
 * Checkout API
 */

// Make the reference property optional, and set the type to "PAYMENT"
import type {
  InitiatePaymentSessionRequest as _InitiatePaymentSessionRequest,
} from "./generated_types/checkout/types.gen.ts";

export type InitiatePaymentSessionRequest = Prettify<
  & Omit<
    MakeNestedPropertyOptional<
      _InitiatePaymentSessionRequest,
      "transaction",
      "reference"
    >,
    "type"
  >
  & {
    type: "PAYMENT";
  }
>;

// Make the reference property optional, and set the type to "SUBSCRIPTION"
import type {
  InitiateSubscriptionSessionRequest as _InitiateSubscriptionSessionRequest,
} from "./generated_types/checkout/types.gen.ts";

export type InitiateSubscriptionSessionRequest = Prettify<
  & Omit<_InitiateSubscriptionSessionRequest, "type">
  & {
    type: "SUBSCRIPTION";
  }
>;

export type {
  CheckoutProblemDetails,
  InitiateSessionResponse,
  SessionResponse,
} from "./generated_types/checkout/types.gen.ts";

/**
 * ePayment API
 */

import type {
  CreatePaymentRequest as _CreatePaymentRequest,
} from "./generated_types/epayment/types.gen.ts";

// Make the reference property optional
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

/**
 * Webhooks API
 */
export type {
  ProblemDetails,
  QueryResponse,
  RegisterRequest,
  RegisterResponse,
} from "./generated_types/webhooks/types.gen.ts";

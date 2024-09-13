/**
 * Utility Types
 */
type PrettifyType<T> = { [K in keyof T]: T[K] } & unknown;

type MakePropertyOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]?: T[P] };

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
import type {
  InitiatePaymentSessionRequest as _InitiatePaymentSessionRequest,
} from "./generated_types/checkout/types.gen.ts";
// Make the reference property optional, and set the type to "PAYMENT"
export type InitiatePaymentSessionRequest = PrettifyType<
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

import type {
  InitiateSubscriptionSessionRequest as _InitiateSubscriptionSessionRequest,
} from "./generated_types/checkout/types.gen.ts";

// Make the reference property optional, and set the type to "SUBSCRIPTION"
export type InitiateSubscriptionSessionRequest = PrettifyType<
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

/**
 * Represents a response from the client.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error details.
 */
export type ClientResponse<TOk, TErr> =
  | {
    ok: true;
    data: TOk;
  }
  | SDKError<TErr>;

/**
 * Represents an error response from the SDK.
 *
 * @template TErr - The type of the error details.
 */
export type SDKError<TErr> = {
  ok: false;
  error: TErr | { message: string };
};

/**
 * Configuration options for the client.
 */
export type ClientConfig = {
  /**
   * The subscription key for a sales unit.
   * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
   *
   * @minLength 1
   * @example da7d5b0e18a84aeda961c0c31b75c2a9
   */
  subscriptionKey: string;

  /**
   * The merchant serial number (MSN) for the sales unit.
   * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
   *
   * @minLength 4
   * @maxLength 7
   * @pattern ^[0-9]{4,7}$
   * @example "1234567"
   */
  merchantSerialNumber: string;

  /**
   * The name of the ecommerce solution.
   * One word in lowercase letters is good.
   * See [http-headers](https://developer.vippsmobilepay.com/docs/knowledge-base/http-headers).
   *
   * @maxLength 30
   * @example "myecommercesolution"
   */
  systemName?: string;

  /**
   * The version number of the ecommerce solution.
   * See [http-headers](https://developer.vippsmobilepay.com/docs/knowledge-base/http-headers).
   *
   * @maxLength 30
   * @example "5.4.0"
   */
  systemVersion?: string;

  /**
   * The name of the ecommerce plugin (if applicable).
   * One word in lowercase letters is good.
   * See [http-headers](https://developer.vippsmobilepay.com/docs/knowledge-base/http-headers).
   *
   * @maxLength 30
   * @example "myecommercesolution-payment"
   */
  pluginName?: string;

  /**
   * The version number of the ecommerce plugin (if applicable).
   * See [http-headers](https://developer.vippsmobilepay.com/docs/knowledge-base/http-headers).
   *
   * @maxLength 30
   * @example "1.2.3"
   */
  pluginVersion?: string;

  /**
   * If true, uses the Vipps test environment.
   *
   * @example false
   * @default false
   */
  useTestMode?: boolean;

  /**
   * If true, retries requests 2 times.
   *
   * @example true
   * @default true
   */
  retryRequests?: boolean;
};

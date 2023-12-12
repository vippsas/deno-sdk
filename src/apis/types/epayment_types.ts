type EPaymentProblemJSON = {
  type: string;
  title: string;
  detail?: string;
  status: number;
  instance: string;
};
export type EpaymentErrorResponse = EPaymentProblemJSON & {
  traceId: string;
  extraDetails: {
    name: string;
    reason: string;
  }[];
};

/**
 * Currency code as defined in ISO 4217. eg NOK for Norwegian kroner.
 * @example "NOK"
 */
type EPaymentCurrency = "NOK" | "DKK" | "EUR";

type EPaymentAmount = {
  /** Currency code as defined in ISO 4217. eg NOK for Norwegian kroner. */
  currency: EPaymentCurrency;
  /**
   * Integer value of price in the currency's monetary subunit (e.g., Norwegian øre),
   * or monetary unit where applicable (e.g., Japanese YEN). The type of the monetary
   * unit is defined in ISO 4217.
   * @format int64
   * @min 0
   * @max 65000000
   * @example 1000
   */
  value: number;
};

/**
 * ReferenceType
 * A reference
 * @minLength 8
 * @maxLength 50
 * @pattern ^[a-zA-Z0-9-]{8,50}$
 * @example "reference-string"
 */
type EPaymentReference = string;

/**
 * AirlineData
 * Airline related data.
 * If present, `passengerName`, `airlineCode`, `airlineDesignatorCode`, and `agencyInvoiceNumber` are all required.
 */
type EPaymentAirlineData = {
  /**
   * Reference number for the invoice, issued by the agency.
   * @minLength 1
   * @maxLength 6
   */
  agencyInvoiceNumber: string;
  /**
   * IATA 3-digit accounting code (PAX); numeric. It identifies the carrier. eg KLM = 074
   * @format IATA 3-digit accounting code (PAX)
   * @minLength 3
   * @maxLength 3
   * @example "074"
   */
  airlineCode: string;
  /**
   * IATA 2-letter accounting code (PAX); alphabetical. It identifies the carrier. Eg KLM = KL
   * @format IATA 2-letter airline code
   * @minLength 2
   * @maxLength 2
   * @example "KL"
   */
  airlineDesignatorCode: string;
  /**
   * Passenger name, initials, and a title.
   * @format last name + first name or initials + title.
   * @minLength 1
   * @maxLength 49
   * @example "FLYER / MARY MS."
   */
  passengerName: string;
  /**
   * The ticket's unique identifier.
   * @minLength 1
   * @maxLength 150
   */
  ticketNumber?: string;
};

/** Additional compliance data related to the transaction. */
type EPaymentIndustryData = {
  /**
   * Airline related data.
   * If present, `passengerName`, `airlineCode`, `airlineDesignatorCode`, and `agencyInvoiceNumber` are all required.
   */
  airlineData?: EPaymentAirlineData;
};

/**
 * The paymentMethod type to be performed.
 * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`.
 * @example "WALLET"
 */
type EPaymentPaymentMethodType = "WALLET" | "CARD";

type EPaymentPaymentMethod = {
  /**
   * The paymentMethod type to be performed.
   * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`.
   */
  type: EPaymentPaymentMethodType;
};

type EPaymentPaymentMethodResponse = {
  /**
   * The paymentMethod type to be performed.
   * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`.
   */
  type: EPaymentPaymentMethodType;
  /**
   * @minLength 6
   * @maxLength 6
   * @example "540185"
   */
  cardBin?: string;
};

type EPaymentProfileRequest = {
  /** A space-separated string list of requested user information in accordance with the OpenID Connect specification. */
  scope?: string;
};

export type EPaymentCreatePaymentRequest = {
  amount: EPaymentAmount;
  customer?: EPaymentCustomer;
  /**
   * The type of customer interaction that triggers the purchase.
   * `CUSTOMER_PRESENT` means that the customer is physically present at the
   * point of sale when the payment is made, typically in a store.
   * @default "CUSTOMER_NOT_PRESENT"
   * @example "CUSTOMER_NOT_PRESENT"
   */
  customerInteraction?: "CUSTOMER_PRESENT" | "CUSTOMER_NOT_PRESENT";
  /** Additional compliance data related to the transaction. */
  industryData?: EPaymentIndustryData;
  paymentMethod: EPaymentPaymentMethod;
  profile?: EPaymentProfileRequest;
  /** A reference */
  reference?: EPaymentReference;
  /**
   * The URL the user is returned to after the payment session.
   * The URL has to use the `https://` scheme or a custom URL scheme.
   * @example "https://example.com/redirect?orderId=acme-shop-123-order123abc"
   */
  returnUrl?: string;
  /**
   * The flow for bringing to user to the Vipps Wallet payment confirmation screen.
   * If `userFlow` is `PUSH_MESSAGE`, a valid value for `customer.phoneNumber` is required.
   * @example "NATIVE_REDIRECT"
   */
  userFlow: "PUSH_MESSAGE" | "NATIVE_REDIRECT" | "WEB_REDIRECT" | "QR";
  /**
   * The payment will expire at the given date and time.
   * The format must adhere to RFC 3339.
   * The value must be more than 10 minutes and less than 28 days in the future.
   * Can only be combined with `userFlow: PUSH_MESSAGE` or `userFlow: QR`.
   * @pattern ^((?:(\d{4}-\d{2}-\d{2})(T|t)(\d{2}:\d{2}:\d{2}(?:\.\d+)?))(Z|z|([+-](?:2[0-3]|[01][0-9]):[0-5][0-9])))$
   * @example "2023-02-26T17:32:28Z"
   */
  expiresAt?: string | null;
  /**
   * Optional setting that is only applicable when `userFlow` is set to `QR`.
   * This is used to set the format for the QR code.
   */
  qrFormat?: {
    /**
     * If `userFlow` is `QR` and `qrFormat` is not set, the QR code image will be returned as `SVG+XML`, by default.
     * @default "IMAGE/SVG+XML"
     * @example "IMAGE/SVG+XML"
     */
    format: "TEXT/TARGETURL" | "IMAGE/SVG+XML" | "IMAGE/PNG";
    /**
     * For example, if the value is 200, then 200x200 px is set as the dimension for the QR code.
     * This is only applicable when the format is set to `PNG`. If not set, the default is 1024.
     * @min 100
     * @max 2000
     * @example 1024
     */
    size?: number | null;
  };
  /**
   * The payment description summary that will be provided to the user through the app, the merchant portal, and the settlement files.
   * @minLength 3
   * @maxLength 100
   */
  paymentDescription?: string;
};

export type EPaymentCreatePaymentOKResponse = {
  redirectUrl: string;
  reference: string;
};

type EPaymentCustomer = {
  /**
   * The phone number of the user paying the transaction with Vipps.
   * Only Norwegian mobile numbers are supported (for now).
   * The format is MSISDN: Digits only: Country code and subscriber
   * number, but no prefix.
   *
   * See: https://en.wikipedia.org/wiki/MSISDN
   * @minLength 10
   * @maxLength 15
   * @pattern ^\d{10,15}$
   * @example 4791234567
   */
  phoneNumber?: string;
};

export type EPaymentGetPaymentOKResponse = {
  aggregate: EPaymentAggregate;
  /** Amount object */
  amount: EPaymentAmount;
  /**
   * State of the Payment.
   * One of:
   * - CREATED : User has not yet acted upon the payment
   * - ABORTED : User has aborted the payment before authorization
   * - EXPIRED: User did not act on the payment within the payment expiration time
   * - AUTHORIZED : User has approved the payment
   * - TERMINATED : Merchant has terminated the payment via the cancelPayment endpoint
   */
  state: EPaymentState;
  paymentMethod: EPaymentPaymentMethodResponse;
  profile: EPaymentProfileResponse;
  /** Reference value for a payment defined by Vipps. */
  pspReference: EPaymentPspReference;
  /**
   * The URL you should redirect the user to to continue with the payment.
   * @format uri
   * @example "https://landing.vipps.no?token=abc123"
   */
  redirectUrl?: string;
  /** A reference */
  reference: EPaymentReference;
};

type EPaymentAggregate = {
  /** Amount object */
  authorizedAmount: EPaymentAmount;
  /** Amount object */
  cancelledAmount: EPaymentAmount;
  /** Amount object */
  capturedAmount: EPaymentAmount;
  /** Amount object */
  refundedAmount: EPaymentAmount;
};

/**
 * State
 * State of the Payment.
 * One of:
 * - CREATED : User has not yet acted upon the payment
 * - ABORTED : User has aborted the payment before authorization
 * - EXPIRED: User did not act on the payment within the payment expiration time
 * - AUTHORIZED : User has approved the payment
 * - TERMINATED : Merchant has terminated the payment via the cancelPayment endpoint
 */
type EPaymentState =
  | "CREATED"
  | "ABORTED"
  | "EXPIRED"
  | "AUTHORIZED"
  | "TERMINATED";

type EPaymentProfileResponse = {
  /**
   * If `profile.scope` was requested in `createPayment` this value will populate once
   * `state` is `AUTHORIZED`. This can be used towards the
   * [Userinfo endpoint](https://developer.vippsmobilepay.com/api/userinfo#operation/getUserinfo)
   * to fetch requested user data.
   */
  sub?: string;
};

/**
 * PspReference
 * Reference value for a payment defined by Vipps.
 */
type EPaymentPspReference = string;

export type EPaymentPaymentEventOKResponse = {
  /** A reference */
  reference: EPaymentReference;
  /** Reference value for a payment defined by Vipps. */
  pspReference: EPaymentPspReference;
  /** @example "AUTHORIZED" */
  name:
    | "CREATED"
    | "ABORTED"
    | "EXPIRED"
    | "CANCELLED"
    | "CAPTURED"
    | "REFUNDED"
    | "AUTHORIZED"
    | "TERMINATED";
  /** Amount object */
  amount: EPaymentAmount;
  /** @format date-time */
  timestamp: string;
  /** The Idempotency key of the request. */
  idempotencyKey?: string | null;
  /** The outcome of the event */
  success: boolean;
};

/** CaptureModificationRequest */
export type EPaymentModificationRequest = {
  /** Amount object */
  modificationAmount: EPaymentAmount;
};

/** ModificationResponse */
export type EPaymentModificationOKResponse = {
  /** Amount object */
  amount: EPaymentAmount;
  /**
   * State of the Payment.
   * One of:
   * - CREATED : User has not yet acted upon the payment
   * - ABORTED : User has aborted the payment before authorization
   * - EXPIRED: User did not act on the payment within the payment expiration time
   * - AUTHORIZED : User has approved the payment
   * - TERMINATED : Merchant has terminated the payment via the cancelPayment endpoint
   */
  state: EPaymentState;
  aggregate: EPaymentAggregate;
  /** Reference value for a payment defined by Vipps. */
  pspReference: EPaymentPspReference;
  /** A reference */
  reference: EPaymentReference;
};

/** ForceApprove */
export type EPaymentForceApproveRequest = {
  /** Target customer */
  customer?: EPaymentCustomer;
  /** The token value received in the redirectUrl property in the Create payment response */
  token?: string;
};

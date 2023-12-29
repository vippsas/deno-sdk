//////////////// Common types /////////////////

/**
 * Only NOK is supported at the moment. Support for EUR and DKK will be provided in early 2024.
 * @minLength 3
 * @maxLength 3
 * @pattern ^[A-Z]{3}$
 * @example "NOK"
 */
export type RecurringCurrencyV3 = "NOK";

/**
 * @default "RECURRING"
 * @example "RECURRING"
 */
export type ChargeType = "INITIAL" | "RECURRING";

/**
 * Type of transaction, either direct capture or reserve capture
 * @example "DIRECT_CAPTURE"
 */
export type RecurringTransactionType = "DIRECT_CAPTURE" | "RESERVE_CAPTURE";

///////////////// Error types /////////////////

export type RecurringErrorResponse = RecurringErrorV3 | RecurringErrorFromAzure;

/**
 * Error response
 * Error response using the Problem JSON format
 */
export type RecurringErrorV3 = {
  /**
   * Path to type of error
   * @example "https://developer.vippsmobilepay.com/docs/APIs/recurring-api/recurring-api-problems#validation-error"
   */
  type?: string;
  /**
   * Short description of the error
   * @example "Bad Request"
   */
  title?: string;
  /**
   * HTTP status returned with the problem
   * @format int32
   * @example 400
   */
  status?: number;
  /**
   * Details about the error
   * @example "Input validation failed"
   */
  detail?: string;
  /**
   * The path of the request
   * @example "/v3/agreements"
   */
  instance?: string;
  /**
   * An unique ID for the request
   * @example "f70b8bf7-c843-4bea-95d9-94725b19895f"
   */
  contextId?: string;
  extraDetails?: {
    /**
     * Field to provide additional details on
     * @example "productName"
     */
    field?: string;
    /**
     * Details for the error of a specific field
     * @example "must not be empty"
     */
    text?: string;
  }[];
};

/**
 * An error from Microsoft Azure. We have limited control of these errors,
 * and can not give as detailed information as with the errors from our own code.
 * The most important property is the HTTP status code.
 */
export type RecurringErrorFromAzure = {
  responseInfo: {
    /** @example 401 */
    responseCode: number;
    /** @example "Unauthorized" */
    responseMessage: string;
  };
  result: {
    /**
     * When possible: A description of what went wrong.
     * @example "(An error from Azure API Management, possibly related to authentication)"
     */
    message: string;
  };
};

//////////////// Charge types /////////////////

export type CreateChargeV3 = {
  /**
   * Amount to be paid by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre/cents. Example: 499 kr = 49900 øre/cents.
   * @format int32
   * @min 100
   * @example 19900
   */
  amount: number;
  /** Type of transaction, either direct capture or reserve capture */
  transactionType: RecurringTransactionType;
  /**
   * This field is visible to the end user in-app
   * @min 1
   * @max 45
   * @example "Månedsabonnement"
   */
  description: string;
  /**
   * The date when the charge is due to be processed.
   *
   * Must be at least two days in advance in the production environment,
   * and at least one day in the test environment.
   *
   * If the charge is `DIRECT_CAPTURE`, the charge is processed and charged on the `due` date.
   * If the charge is `RESERVE_CAPTURE`, the charge is `RESERVED` on `due` date.
   *
   * Must be in the format `YYYY-MM-DD` and ISO 8601.
   * @example "2030-12-31"
   */
  due: string;
  /**
   * The service will attempt to charge the customer for the number of days
   * specified in `retryDays` after the `due` date.
   * We recommend at least two days retry.
   * @format int32
   * @min 0
   * @max 14
   * @example 5
   */
  retryDays: number;
  /**
   * An optional, but recommended `orderId` for the charge.
   * If provided, this will be the `chargeId` for this charge.
   * This is the unique identifier of the payment, from the payment is initiated and all the way to the settlement data.
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   * If no `orderId` is specified, the `chargeId` will be automatically generated.
   * @minLength 1
   * @maxLength 50
   * @pattern ^[a-zA-Z\d-]+
   * @example "acme-shop-123-order123abc"
   */
  orderId?: string;
  /**
   * An optional external ID for the charge, that takes the place of the `orderId` in settlement reports without overriding the default `chargeId`
   * The `externalId` can be used by the merchant to map the `chargeId` to an ID in a subscription system or similar.
   * Note that while `orderId` must be unique per merchant, `externalId` does not have this limitation,
   * so you need to avoid assigning the same `externalId` to multiple charges if you want to keep them separate in settlement reports.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId?: string;
};

export type ChargeReference = {
  /**
   * Unique identifier for this charge, up to 15 characters.
   * @maxLength 15
   * @example "chg_WCVbcAbRCmu2zk"
   */
  chargeId: string;
};

export type ChargeResponseV3 = {
  /**
   * Amount to be paid by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  amount: number;
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: RecurringCurrencyV3;
  /**
   * Description of the charge
   * @example "Premier League subscription: September"
   */
  description: string;
  /**
   * The due date for this charge
   * @format date-time
   * @example "2019-06-01T00:00:00Z"
   */
  due: string;
  /**
   * Identifier for this charge (for this customer's subscription).
   * @maxLength 15
   * @example "chr_WCVbcA"
   */
  id: string;
  /**
   * Id of the agreement the charge belongs to
   * @example "agr_5kSeqz"
   */
  agreementId: string;
  /**
   * An optional external ID for the charge
   * The `externalId` can be used by the merchant to map the `chargeId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId: string;
  /**
   * An optional external ID for the agreement
   * The `externalId` can be used by the merchant to map the `agreementId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalAgreementId?: string;
  /**
   * The service will attempt to charge the customer for the number of days
   * specified in `retryDays` after the `due` date.
   * We recommend at least two days retry.
   * @format int32
   * @min 0
   * @max 14
   * @example 5
   */
  retryDays: number;
  status: ChargeStatus;
  /**
   * Contains null until the status has reached CHARGED
   * @maxLength 36
   * @pattern ^\d{10+}$
   * @example "5001419121"
   */
  transactionId: string;
  type: ChargeType;
  /** Type of transaction, either direct capture or reserve capture */
  transactionType: RecurringTransactionType;
  /**
   * Identifies the reason why the charged has been marked as `FAILED`:
   *   * `user_action_required` - The user's card can not fulfil the payment, user needs to take action in the Vipps or MobilePay app.
   *      Examples: Card is blocked for ecommerce, insufficient funds, expired card.
   *
   *   * `charge_amount_too_high` - The user's max amount is too low, user needs to update their max amount in the Vipps or MobilePay app.
   *
   *   * `non_technical_error` - Something went wrong with charging the user.
   *      Examples: User has deleted their Vipps MobilePay Profile.
   *
   *   * `technical_error` - Something went wrong in Recurring while performing the payment.
   *      Examples: Failure in Recurring, failure in downstream services.
   * @example "user_action_required"
   */
  failureReason?:
    | "user_action_required"
    | "charge_amount_too_high"
    | "non_technical_error"
    | "technical_error"
    | null;
  /**
   * Description for the failure reason
   * @example "User action required"
   */
  failureDescription?: string;
  /** A summary of the amounts captured, refunded and cancelled */
  summary: ChargeSummary;
  /** List of events related to the charge. */
  history: ChargeEvent[];
};

/** @example "PENDING" */
export type ChargeStatus =
  | "PENDING"
  | "DUE"
  | "RESERVED"
  | "CHARGED"
  | "PARTIALLY_CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED"
  | "PROCESSING";

/** A summary of the amounts captured, refunded and cancelled */
export type ChargeSummary = {
  /**
   * The total amount which has been captured/charged, in case of status charged/partial capture.
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  captured: number;
  /**
   * The total amount which has been refunded, in case of status refund/partial refund.
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 0
   */
  refunded: number;
  /**
   * The total amount which has been cancelled.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  cancelled: number;
};

/** Describes the operation that was performed on the charge */
export type ChargeEvent = {
  /**
   * Date and time of the event, as timestamp on the format `yyyy-MM-dd'T'HH:mm:ss'Z'`,
   * with or without milliseconds.
   * @format date-time
   * @example "2022-09-05T14:25:55Z"
   */
  occurred: string;
  /** @example "RESERVE" */
  event: "CREATE" | "RESERVE" | "CAPTURE" | "REFUND" | "CANCEL" | "FAIL";
  /**
   * The amount related to the operation.
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  amount: number;
  /** The idempotency key of the event */
  idempotencyKey: string;
  /** True if the operation was successful, false otherwise */
  success: boolean;
};

/** Refund charge request */
export type ModifyCharge = {
  /**
   * The amount to refund/capture on a charge.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 5000
   */
  amount: number;
  /**
   * A textual description of the operation (refund or capture), which will be displayed in the user's app.
   * @min 1
   * @example "'Forgot to apply discount, refunding 50%' or: 'Not all items were in stock. Partial capture.'"
   */
  description: string;
};

////////////// Agreement types ////////////////
/**
 * Status of the agreement.
 * @default "ACTIVE"
 * @example "ACTIVE"
 */
export type AgreementStatus = "PENDING" | "ACTIVE" | "STOPPED" | "EXPIRED";

////////////// Create agreement ///////////////
export type DraftAgreementV3 = {
  campaign?: AgreementCampaignV3;
  pricing: AgreementPricingRequest;
  /**
   * Customers phone number (if available). Used to simplify the
   * following interaction. MSISDN: https://en.wikipedia.org/wiki/MSISDN
   * @maxLength 15
   * @example "4791234567"
   */
  phoneNumber?: string;
  /**
   * An initial charge for a new agreement.
   * The charge will be processed immediately when the user approves the agreement.
   */
  initialCharge?: AgreementInitialChargeV3;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  interval: AgreementTimePeriod;
  /**
   * This optional parameter indicates whether payment request is triggered from
   * Mobile App or Web browser. Based on this value, response will be
   * redirect URL for Vipps MobilePay landing page or deeplink URL to connect vipps
   * App. When isApp is set to true, URLs passed to us will not be
   * validated as regular URLs.
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/isApp
   * @default false
   * @example false
   */
  isApp?: boolean;
  /**
   * URL where we can send the customer to view/manage their
   * subscription. Typically a "My page" where the user can change, pause, cancel, etc.
   * The page must offer actual management, not just information about how to
   * contact customer service, etc.
   * We recommend letting users
   * [log in](https://developer.vippsmobilepay.com/docs/APIs/login-api),
   * not with username and password.
   * We do not have any specific requirements for the security of the page other than requiring HTTPS.
   * Only HTTPS scheme is allowed.
   * @maxLength 1024
   * @example "https://example.com/vipps-subscriptions/1234/"
   */
  merchantAgreementUrl: string;
  /**
   * URL where customer should be redirected after the agreement has been
   * approved/rejected in the Vipps mobile application.
   * HTTPS and deeplinks are allowed (example: myApp://home)
   * @maxLength 1024
   * @example "https://example.com/redirect"
   */
  merchantRedirectUrl: string;
  /**
   * Product name (short)
   * @maxLength 45
   * @example "Premier League subscription"
   */
  productName: string;
  /**
   * Product description (longer)
   * @maxLength 100
   */
  productDescription?: string;
  /**
   * Space-separated list of the required user information (e.g., "name phoneNumber")
   * for the agreement. See the
   * [Userinfo user guide](https://developer.vippsmobilepay.com/docs/APIs/userinfo-api/userinfo-api-guide#scope)
   * for details.
   * Possible values are:
   * - name
   * - address
   * - email
   * - phoneNumber
   * - birthDate
   * - nin
   * @example "address name email birthDate phoneNumber"
   */
  scope?: string;
  /**
   * If the property is set to `true`, it will cause a push notification
   * to be sent to the given phone number immediately, without loading
   * the landing page.
   * This feature has to be specially enabled for eligible sales
   * units: The sales units must be whitelisted by Vipps MobilePay. If the sales unit is not whitelisted,
   * the request will fail and an error message will be returned (statusCode=403).
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/landing-page
   * @default false
   * @example false
   */
  skipLandingPage?: boolean;
  /**
   * An optional external ID for the agreement.
   * The `externalId` can be used by the merchant to map the `agreementId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId?: string;
  /**
   * An optional country code for the agreement according to ISO 3166-2 (two capital letters)
   * @pattern ^[A-Z]{2}$
   * @example "NO"
   */
  countryCode?: string;
};

export type AgreementPricingRequest = {
  /**
   * The type of pricing. This decides which properties are required.
   * @default "LEGACY"
   */
  type?: "LEGACY" | "VARIABLE";
  /** Only NOK is supported at the moment. Support for EUR and DKK will be provided in early 2024. */
  currency: RecurringCurrencyV3;
  /**
   * The price of the agreement, required if type is LEGACY or not present.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 1500
   */
  amount?: number;
  /**
   * The suggested max amount that the customer should choose, required if type is VARIABLE.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @max 2000000
   * @example 3000
   */
  suggestedMaxAmount?: number;
};

/**
 * InitialCharge
 * An initial charge for a new agreement.
 * The charge will be processed immediately when the user approves the agreement.
 */
export type AgreementInitialChargeV3 = {
  /**
   * The amount that must be paid or approved before starting the agreement.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  amount: number;
  /**
   * This field is visible to the end user in-app
   * @example "Månedsabonnement"
   */
  description: string;
  /**
   * The type of payment to be made.
   * @example "DIRECT_CAPTURE"
   */
  transactionType: RecurringTransactionType;
  /**
   * An optional, but recommended `orderId` for the charge.
   * If provided, this will be the `chargeId` for this charge.
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   * If no `orderId` is specified, the `chargeId` will be automatically generated.
   * @example "acme-shop-123-order123abc"
   */
  orderId?: string;
  /**
   * An optional external ID for the charge
   * The `externalId` can be used by the merchant to map the `chargeId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId?: string;
};

/**
 * Time Period request
 * A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units)
 */
export type AgreementTimePeriod = {
  /**
   * Unit for time period
   * @example "WEEK"
   */
  unit: AgreementInterval;
  /**
   * Number of units in the time period. Example: unit=week, count=2 to define two weeks
   * @format int32
   * @min 1
   * @exclusiveMin false
   * @max 31
   * @exclusiveMax false
   * @example 2
   */
  count: number;
};

/**
 * Interval for subscription
 * @default "MONTH"
 * @pattern ^(YEAR|MONTH|WEEK|DAY)$
 * @example "MONTH"
 */
export type AgreementInterval = "YEAR" | "MONTH" | "WEEK" | "DAY";

export type DraftAgreementResponseV3 = {
  /**
   * Id of a an agreement which user may agree to.
   * Initially the agreement is in a pending state waiting for user approval.
   * It enters active state once the user has approved it in the Vipps or MobilePay app.
   * @example "agr_5kSeqz"
   */
  agreementId: string;
  /**
   * UUID (RFC 4122) representation of agreementId
   * @format uuid
   * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
   * @example "9c2ca95c-245f-4a2e-aab2-4a08eb78e6fb"
   */
  uuid: string;
  /**
   * The `vippsConfirmationUrl` should be used to redirect the
   * user to the Vipps MobilePay landing page in a desktop flow (with `https://`),
   * or to the Vipps or MobilePay app in a mobile flow (with `vipps://`), where the
   * user can then approve the agreement.
   * @example "https://api.vipps.no/v2/register/U6JUjQXq8HQmmV"
   */
  vippsConfirmationUrl?: string;
  /**
   * The Id of the initialCharge if given, otherwise `null`.
   * If an `orderId` is specified this is used as the `chargeId` otherwise it is auto generated.
   * @pattern ^[a-zA-Z0-9-]{1,50}$
   * @example "chr_5kSeqz"
   */
  chargeId?: string | null;
};

/////////////// Agreement Info ////////////////
export type AgreementResponseV3 = {
  campaign?: AgreementCampaignResponseV3 | null;
  pricing: AgreementPricingResponse;
  /**
   * Uniquely identifies this agreement
   * @maxLength 36
   * @example "agr_DdLnJAF"
   */
  id: string;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  interval: AgreementTimePeriodResponse;
  /**
   * Product name (short)
   * @maxLength 45
   * @example "Premier League subscription"
   */
  productName: string;
  /**
   * Product description (longer)
   * @maxLength 100
   */
  productDescription?: string;
  /**
   * Date when agreement was created, in ISO 8601 format.
   * This is when the agreement was initiated with the API.
   * @format date-time
   * @example "2019-01-01T00:00:00Z"
   */
  created: string;
  /**
   * Date and time when agreement was started, in ISO 8601 format.
   * This is when the agreement was activated.
   * @format date-time
   * @example "2019-01-01T00:00:00Z"
   */
  start?: string | null;
  /**
   * Date and time when agreement was stopped, in ISO 8601 format.
   * @format date-time
   * @example null
   */
  stop?: string | null;
  /** Status of the agreement. */
  status?: AgreementStatus;
  /**
   * URL where we can send the customer to view/manage their
   * subscription. Typically a "My page" where the user can change, pause, cancel, etc.
   * The page must offer actual management, not just information about how to
   * contact customer service, etc.
   * We recommend letting users log in with Vipps MobilePay, not with username and password:
   * https://developer.vippsmobilepay.com/docs/APIs/login-api
   * We do not have any specific requirements for the security of the
   * page other than requiring HTTPS.
   * @example "https://example.com/vipps-subscriptions/1234/"
   */
  merchantAgreementUrl: string;
  /**
   * URL where customer should be redirected after the agreement has been
   * approved/rejected in the Vipps or MobilePay app.
   * HTTPS and deeplinks are allowed (example: myApp://home)
   * @maxLength 1024
   * @example "https://example.com/landing"
   */
  merchantRedirectUrl: string;
  /**
   * User identifier (subject). Will be null if profile data was not requested.
   * @example "8d7de74e-0243-11eb-adc1-0242ac120002"
   */
  sub?: string | null;
  /**
   * The full path of the URL for the userinfo endpoint where the user data can be retrieved.:
   * [`GET:/vipps-userinfo-api/userinfo/{sub}`](https://developer.vippsmobilepay.com/api/userinfo#operation/getUserinfo).
   * This will be null if profile data was not requested.
   * @example "https://api.vipps.no/vipps-userinfo-api/userinfo/8d7de74e-0243-11eb-adc1-0242ac120002"
   */
  userinfoUrl?: string | null;
  /**
   * An optional external ID for the agreement.
   * The `externalId` can be used by the merchant to map the `agreementId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId?: string;
  /**
   * An optional country code for the agreement according to ISO 3166-2 (two capital letters)
   * @pattern ^[A-Z]{2}$
   * @example "NO"
   */
  countryCode: string;
  /**
   * UUID (RFC 4122) representation of ID
   * @format uuid
   * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
   * @example "9c2ca95c-245f-4a2e-aab2-4a08eb78e6fb"
   */
  uuid: string;
  /**
   * The `vippsConfirmationUrl` should be used to redirect the
   * user to the Vipps MobilePay landing page in a desktop flow (with `https://`),
   * or to the Vipps or MobilePay app in a mobile flow (with `vipps://`), where the
   * user can then approve the agreement.
   * @example "https://api.vipps.no/v2/register/U6JUjQXq8HQmmV"
   */
  vippsConfirmationUrl?: string;
};

/**
 * Time Period response
 * A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units)
 */
export type AgreementTimePeriodResponse = {
  /**
   * Unit for time period
   * @example "WEEK"
   */
  unit?: AgreementInterval;
  /**
   * Number of units in the time period. Example: unit=week, count=2 to define two weeks
   * @format int32
   * @example 2
   */
  count?: number;
  /**
   * Textual representation used in VIPPS to describe the time period
   * @example "every 2 weeks"
   */
  text?: string;
};

export type AgreementPricingResponse =
  | AgreementLegacyPricingResponse
  | AgreementVariableAmountPricingResponse;

export type AgreementLegacyPricingResponse = {
  /** The type of pricing. This decides which properties are present. */
  type: "LEGACY";
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: RecurringCurrencyV3;
  /**
   * The price of the agreement, present if type is LEGACY.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  amount: number;
};

export type AgreementVariableAmountPricingResponse = {
  /** The type of pricing. This decides which properties are present. */
  type: "VARIABLE";
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: RecurringCurrencyV3;
  /**
   * The suggested max amount that the customer should choose, present if type is VARIABLE.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 30000
   */
  suggestedMaxAmount: number;
  /**
   * The max amount chosen by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 30000
   */
  maxAmount: number;
};

////////////// Update agreements //////////////
export type PatchAgreementV3 = {
  /**
   * Name of the product being subscribed to.
   * @maxLength 45
   * @example "Pluss-abonnement"
   */
  productName?: string;
  /**
   * Product description (longer)
   * @maxLength 100
   */
  productDescription?: string;
  /**
   * URL where we can send the customer to view/manage their
   * subscription. Typically a "My page" where the user can change, pause, cancel, etc.
   * The page must offer actual management, not just information about how to
   * contact customer service, etc.
   * We recommend letting users log in with Vipps MobilePay, not with username and password:
   * https://developer.vippsmobilepay.com/docs/APIs/login-api
   * We do not have any specific requirements for the security of the
   * page other than requiring HTTPS.
   * @maxLength 1024
   * @example "https://example.com/vipps-subscriptions/1234/"
   */
  merchantAgreementUrl?: string;
  /**
   * An optional external ID for the agreement.
   * The `externalId` can be used by the merchant to map the `agreementId`
   * to an ID in a subscription system or similar.
   * @minLength 1
   * @maxLength 64
   * @pattern ^.{1,64}$
   * @example "external-id-2468"
   */
  externalId?: string;
  /**
   * Status of the agreement.
   * @example "STOPPED"
   */
  status?: AgreementStatus;
  pricing?: AgreementPricingUpdateRequest;
  /**
   * The interval of the agreement.
   *
   * The interval is specified by the `type` and `period` properties.
   * When the type is `RECURRING`, then the property `period` is required.
   */
  interval?: {
    /**
     * @default "RECURRING"
     * @example "RECURRING"
     */
    type?: ChargeType;
    /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
    period?: AgreementTimePeriod;
  };
};

export type AgreementPricingUpdateRequest = {
  /**
   * The price of the agreement, can only be updated if agreement type is LEGACY
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 1500
   */
  amount?: number;
  /**
   * The suggested max amount that the customer should choose, can only be updated if agreement type is VARIABLE.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @max 2000000
   * @example 3000
   */
  suggestedMaxAmount?: number;
};

export type ForceAcceptAgreementV3 = {
  /** @example "4791234567" */
  phoneNumber: string;
};

////////////////// Campaigns //////////////////
export type AgreementCampaignV3 =
  | AgreementPriceCampaignV3
  | AgreementPeriodCampaignV3
  | AgreementEventCampaignV3
  | AgreementFullFlexCampaignV3;

export type AgreementPriceCampaignV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "PRICE_CAMPAIGN";

  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends.
   * Needs to be UTC.
   * @example "2019-06-01T00:00:00Z"
   */
  end: string;
} | null;

export type AgreementPeriodCampaignV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "PERIOD_CAMPAIGN";

  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  period: AgreementTimePeriod;
} | null;

export type AgreementEventCampaignV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "EVENT_CAMPAIGN";
  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends. Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  eventDate: string;
  /**
   * A short text that describes the event
   * @example "Until Christmas"
   */
  eventText: string;
} | null;

export type AgreementFullFlexCampaignV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "FULL_FLEX_CAMPAIGN";
  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  interval: AgreementTimePeriod;
  /**
   * The date and time the campaign ends.
   * Needs to be UTC.
   * @example "2019-06-01T00:00:00Z"
   */
  end: string;
} | null;

export type AgreementCampaignResponseV3 =
  | AgreementPriceCampaignResponseV3
  | AgreementPeriodCampaignResponseV3
  | AgreementEventCampaignResponseV3
  | AgreementFullFlexCampaignResponseV3
  | AgreementLegacyCampaignResponseV3;

export type AgreementPriceCampaignResponseV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "PRICE_CAMPAIGN";

  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends. Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  end: string;
  /**
   * The text displayed in the Vipps or MobilePay app to explain the campaign to the user
   * @example "Ordinary price 399 kr starts 6/12/2022"
   */
  explanation?: string;
};

export type AgreementPeriodCampaignResponseV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "PERIOD_CAMPAIGN";

  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends.
   * Needs to be UTC.
   * @example "2019-06-01T00:00:00Z"
   */
  end: string;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  period: AgreementTimePeriod;
  /**
   * The text displayed in the Vipps or MobilePay app to explain the campaign to the user
   * @example "Ordinary price 399 kr starts 6/12/2022"
   */
  explanation?: string;
};

export type AgreementEventCampaignResponseV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "EVENT_CAMPAIGN";

  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends. Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  eventDate: string;
  /**
   * A short text that describes the event
   * @example "Until Christmas"
   */
  eventText: string;
  /**
   * The text displayed in the Vipps or MobilePay app to explain the campaign to the user
   * @example "Ordinary price 399 kr starts 6/12/2022"
   */
  explanation?: string;
};

export type AgreementFullFlexCampaignResponseV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "FULL_FLEX_CAMPAIGN";
  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends.
   * Needs to be UTC.
   * @example "2019-06-01T00:00:00Z"
   */
  end: string;
  /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
  interval: AgreementTimePeriod;
  /**
   * The text displayed in the Vipps or MobilePay app to explain the campaign to the user
   * @example "Ordinary price 399 kr starts 6/12/2022"
   */
  explanation?: string;
};

export type AgreementLegacyCampaignResponseV3 = {
  /** The type of campaign. This decides which properties are required */
  type: "LEGACY_CAMPAIGN";
  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  price: number;
  /**
   * The date and time the campaign ends.
   * Needs to be UTC.
   * @example "2019-06-01T00:00:00Z"
   */
  end: string;
  /**
   * The text displayed in the Vipps or MobilePay app to explain the campaign to the user
   * @example "Ordinary price 399 kr starts 6/12/2022"
   */
  explanation?: string;
};

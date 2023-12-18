/** @example "PENDING" */
type AgreementChargeStatus =
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
interface AgreementChargeSummary {
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
}

/** List of events related to the charge. */
type AgreementChargeHistory = AgreementChargeEvent[];

/** Describes the operation that was performed on the charge */
interface AgreementChargeEvent {
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
}

/**
 * Type of transaction, either direct capture or reserve capture
 * @example "DIRECT_CAPTURE"
 */
type AgreementTransactionType = "DIRECT_CAPTURE" | "RESERVE_CAPTURE";

/**
 * @default "RECURRING"
 * @example "RECURRING"
 */
type AgreementChargeType = "INITIAL" | "RECURRING";

/**
 * Interval for subscription
 * @default "MONTH"
 * @pattern ^(YEAR|MONTH|WEEK|DAY)$
 * @example "MONTH"
 */
type AgreementInterval = "YEAR" | "MONTH" | "WEEK" | "DAY";

/** DraftAgreement */
interface AgreementDraftAgreementV2 {
  variableAmount?: AgreementVariableAmount;
  campaign?: AgreementCampaignV2;
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: AgreementCurrency;
  /**
   * Customers phone number (if available). Used to simplify the
   * following Vipps MobilePay interaction.
   * The format is MSISDN: Digits only: Country code and subscriber
   * number, but no prefix.
   * If the phone number is a Norwegian phone number `(+47) 91 23 45 67`, the MSISDN representation is `4791234567`.
   * See: https://en.wikipedia.org/wiki/MSISDN
   * @minLength 10
   * @maxLength 15
   * @pattern ^\d{10,15}$
   * @example "4791234567"
   */
  customerPhoneNumber?: string;
  /**
   * An initial charge for a new agreement.
   * The charge will be processed immediately when the user approves the agreement.
   */
  initialCharge?: AgreementInitialChargeV2;
  /** Interval for subscription */
  interval: AgreementInterval;
  /**
   * Number of intervals between charges. Example: interval=week,
   * intervalCount=2 to be able to charge every two weeks.
   * Charges should occur at least once a year.
   * @format int32
   * @min 1
   * @max 31
   * @example 2
   */
  intervalCount: number;
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
   * URL where you can send the customer to view/manage their
   * subscription. Typically a "My page" where the user can change, pause, cancel, etc.
   * The page must offer management tools, not just information about how to
   * contact customer service, etc.
   * We recommend letting users
   * [log in](https://developer.vippsmobilepay.com/docs/APIs/login-api),
   * not with username and password.
   * We do not have any specific requirements for the security of the page other than requiring HTTPS.
   * Only HTTP or HTTPS scheme is allowed.
   * @maxLength 1024
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
   * The price of the agreement.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 7900
   */
  price: number;
  /**
   * Product name (short)
   * @maxLength 45
   * @example "Premier League subscription"
   */
  productName: string;
  /**
   * Product description (longer)
   * @maxLength 100
   * @example "Access to all games of English top football"
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
   * @example "name email birthDate phoneNumber"
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
}

/** Agreement response */
interface AgreementAgreementResponseV2 {
  campaign?: AgreementCampaignV2;
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency?: AgreementCurrency;
  /**
   * Uniquely identifies this agreement
   * @maxLength 36
   * @example "agr_DdLnJAF"
   */
  id: string;
  /** Interval for subscription */
  interval: AgreementInterval;
  /**
   * Number of intervals between charges. Example: interval=WEEK, intervalCount=2 to be able to charge every two weeks. Charges should occur at least once a year.
   * @format int32
   * @min 1
   * @max 31
   * @example 2
   */
  intervalCount: number;
  /**
   * The price of the agreement.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 0
   * @example 49900
   */
  price: number;
  /**
   * Product name (short)
   * @maxLength 45
   * @example "Premier League subscription"
   */
  productName: string;
  /**
   * Product description (longer)
   * @maxLength 100
   * @example "Access to all games of English top football"
   */
  productDescription: string;
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
  status?: AgreementAgreementStatus;
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
  merchantAgreementUrl?: string;
  /**
   * User identifier (subject). Will be null if profile data was not requested.
   * @example "8d7de74e-0243-11eb-adc1-0242ac120002"
   */
  sub?: string | null;
  /**
   * The full path of the URL for the userinfo endpoint where the user data can be retrieved:
   * [`GET:/vipps-userinfo-api/userinfo/{sub}`](https://developer.vippsmobilepay.com/api/userinfo#operation/getUserinfo).
   * This will be null if profile data was not requested.
   * @example "https://api.vipps.no/vipps-userinfo-api/userinfo/8d7de74e-0243-11eb-adc1-0242ac120002"
   */
  userinfoUrl?: string | null;
  variableAmount?: AgreementVariableAmountResponse;
}



/** PatchAgreement */
interface AgreementPatchAgreementV2 {
  /**
   * The suggested max amount that the customer should choose.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @max 2000000
   * @example 3000
   */
  suggestedMaxAmount?: number;
  campaign?: AgreementCampaignV2;
  /**
   * The price of the agreement.
   *
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 0
   * @example 7900
   */
  price?: number;
  /**
   * Product name (short)
   * @maxLength 45
   * @example "Premier League subscription"
   */
  productName?: string;
  /**
   * Product description (longer)
   * @maxLength 100
   * @example "Access to all games of English top football"
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
   * Status of the agreement.
   * @example "STOPPED"
   */
  status?: "STOPPED";
}

/** PatchAgreement */
interface AgreementPatchAgreementV3 {
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
  status?: "STOPPED";
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
    type?: "RECURRING";
    /** A period of time, defined by a unit (DAY, WEEK, ...) and a count (number of said units) */
    period?: AgreementTimePeriod;
  };
}

/** Agreement reference */
interface AgreementAgreementReference {
  /**
   * Id of a an agreement which user may agree to.
   * Initially the agreement is in a pending state waiting for user approval.
   * It enters active state once the user has approved it in the Vipps or MobilePay app.
   * @example "agr_asdf123"
   */
  agreementId: string;
}

/** Variable Amount request */
interface AgreementVariableAmount {
  /**
   * The suggested max amount that the customer should choose.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @max 2000000
   * @example 3000
   */
  suggestedMaxAmount: number;
}

/** Variable Amount response */
interface AgreementVariableAmountResponse {
  /**
   * The suggested max amount that the customer should choose.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 3000
   */
  suggestedMaxAmount?: number;
  /**
   * The max amount chosen by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 3000
   */
  maxAmount?: number;
}

/** Campaign request */
type AgreementCampaignV2 = {
  /**
   * The price of the agreement in the discount period.
   * The lowering of the price will be displayed in-app.
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  campaignPrice: number;
  /**
   * The date and time the campaign ends.
   * This is a required field for `EVENT_CAMPAIGN`, and is illegal for other types.
   * But: If you add this type of info, you also need to add that interval
   * and end is used by `FULL_FLEX_CAMPAIGN` and that period is used by `PERIOD_CAMPAIGN`, etc.
   * Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  end: string;
} | null;

/** Campaign response */
interface AgreementCampaignResponseV2 {
  /**
   * The price of the agreement in the discount period. The lowering of the price will be displayed in-app.
   * Price is specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 1500
   */
  campaignPrice?: number;
  /**
   * The date and time the campaign starts. Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  start?: string;
  /**
   * The date and time the campaign ends.
   * This is a required field when using `EVENT_CAMPAIGN`.
   * Must be UTC.
   * @format date-time
   * @example "2022-12-31T00:00:00Z"
   */
  end?: string;
}

/** UpdateAgreementPricingRequest */
interface AgreementPricingUpdateRequest {
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
}

/**
 * InitialCharge
 * An initial charge for a new agreement.
 * The charge will be processed immediately when the user approves the agreement.
 */
interface AgreementInitialChargeV2 {
  /**
   * The amount that must be paid or approved before starting the agreement.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  amount: number;
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: AgreementCurrency;
  /**
   * This field is visible to the end user in-app
   * @example "Månedsabonnement"
   */
  description: string;
  /**
   * The type of payment to be made.
   * @example "DIRECT_CAPTURE"
   */
  transactionType: "RESERVE_CAPTURE" | "DIRECT_CAPTURE";
  /**
   * An optional, but recommended `orderId` for the charge.
   * If provided, this will be the `chargeId` for this charge.
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   * If no `orderId` is specified, the `chargeId` will be automatically generated.
   * @example "acme-shop-123-order123abc"
   */
  orderId?: string;
}

/** CreateCharge */
interface AgreementCreateChargeV2 {
  /**
   * Amount to be paid by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 19900
   */
  amount: number;
  /** ISO-4217: https://www.iso.org/iso-4217-currency-codes.html */
  currency: AgreementCurrency;
  /**
   * This field is visible to the end user in-app
   * @min 1
   * @max 45
   * @example "Månedsabonnement"
   */
  description: string;
  /**
   * The date when the charge is due to be processed.
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
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   * If no `orderId` is specified, the `chargeId` will be automatically generated.
   * @max 50
   * @pattern ^[a-zA-Z\d-]+
   * @example "acme-shop-123-order123abc"
   */
  orderId?: string;
}

/** CreateCharge */
interface AgreementCreateChargeV3 {
  /**
   * Amount to be paid by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 19900
   */
  amount: number;
  /** Type of transaction, either direct capture or reserve capture */
  transactionType: AgreementTransactionType;
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
}

/** Charge reference */
interface AgreementChargeReference {
  /**
   * Unique identifier for this charge, up to 15 characters.
   * @maxLength 15
   * @example "chg_WCVbcAbRCmu2zk"
   */
  chargeId?: string;
}

/** ChargeResponse */
interface AgreementChargeResponseV2 {
  /**
   * Amount to be paid by the customer.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 19900
   */
  amount: number;
  /**
   * The total amount which has been refunded, in case of status refund/partial refund.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @example 0
   */
  amountRefunded: number;
  /**
   * Description of the charge.
   * @example "Premier League subscription: September"
   */
  description: string;
  /**
   * The due date for this charge.
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
  status: AgreementChargeStatus;
  /**
   * Contains null until the status has reached CHARGED.
   * @maxLength 36
   * @pattern ^\d{10+}$
   * @example "5001419121"
   */
  transactionId: string;
  type: AgreementChargeType;
  /**
   * Identifies the reason why the charged has been marked as `FAILED`:
   *   * `user_action_required` - The user's card can not fulfil the payment. The user needs to take action in the app.
   *      Examples: Card is blocked for ecommerce, insufficient funds, expired card.
   *
   *   * `charge_amount_too_high` - The user's max amount is too low. The user needs to update their max amount in the Vipps or MobilePay app.
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
    | "technical_error";
  /**
   * Description for the failure reason.
   * @example "User action required"
   */
  failureDescription?: string;
}

/** ChargeResponse */
interface AgreementChargeResponseV3 {
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
  currency: AgreementCurrency;
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
  status: AgreementChargeStatus;
  /**
   * Contains null until the status has reached CHARGED
   * @maxLength 36
   * @pattern ^\d{10+}$
   * @example "5001419121"
   */
  transactionId: string;
  type: AgreementChargeType;
  /** Type of transaction, either direct capture or reserve capture */
  transactionType: AgreementTransactionType;
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
  summary: AgreementChargeSummary;
  /** List of events related to the charge. */
  history: AgreementChargeHistory;
}

/** Refund charge request */
interface AgreementRefundRequest {
  /**
   * The amount to refund on a captured/charged charge.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 5000
   */
  amount: number;
  /**
   * A textual description of the operation, which will be displayed in the user's app.
   * @min 1
   * @example "Forgot to apply discount, refunding 50%"
   */
  description: string;
}

/** Capture charge request */
interface AgreementCaptureRequestV3 {
  /**
   * The amount to capture on a reserved charge.
   *
   * Amounts are specified in minor units.
   * For Norwegian kroner (NOK) that means 1 kr = 100 øre. Example: 499 kr = 49900 øre.
   * @format int32
   * @min 100
   * @example 5000
   */
  amount: number;
  /**
   * A textual description of the operation, which will be displayed in the user's app.
   * @min 1
   * @example "Not all items were in stock. Partial capture."
   */
  description: string;
}

/** Force accept agreement request */
interface AgreementForceAcceptAgreement {
  /** @example "91234567" */
  customerPhoneNumber: string;
}

/** Force accept agreement request */
interface AgreementForceAcceptAgreementV3 {
  /** @example "4791234567" */
  phoneNumber: string;
}


import {
  ChargeType,
  RecurringCurrencyV3,
  RecurringTransactionType,
} from "./recurring_types.ts";

export type CreateChargeV3 = {
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
  history: ChargeHistory;
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
type ChargeSummary = {
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

/** List of events related to the charge. */
type ChargeHistory = ChargeEvent[];

/** Describes the operation that was performed on the charge */
type ChargeEvent = {
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

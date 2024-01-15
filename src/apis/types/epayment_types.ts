/////////////// Error Types ///////////////

import { MerchantSerialNumber, Scope } from "./shared_types.ts";

export type EPaymentProblemJSON = {
  type: string;
  title: string;
  detail?: string;
  status: number;
  instance: string;
};
export type EPaymentErrorResponse = EPaymentProblemJSON & {
  traceId: string;
  extraDetails: {
    name: string;
    reason: string;
  }[];
};

/////////////// Create Payment Request ///////////////

export type EPaymentCreatePaymentRequest = {
  /** Amount object, containing a value and a currency. */
  amount: EPaymentAmount;
  /**
   * Customer phone number (object) or Personal QR code (object)
   * or Customer token (object) (Customer)
   * The target customer if the identity is known. The customer can be
   * specified either with phone number, the customer token or with the
   * user's personal QR code Specifying more than one of these will
   * result in an error.
   */
  customer?: EPaymentCustomer;
  /**
   * The type of customer interaction that triggers the purchase.
   * `CUSTOMER_PRESENT` means that the customer is physically present at the
   * point of sale when the payment is made, typically in a store.
   *
   * @default "CUSTOMER_NOT_PRESENT"
   * @example "CUSTOMER_PRESENT"
   */
  customerInteraction?: "CUSTOMER_PRESENT" | "CUSTOMER_NOT_PRESENT";
  /** Additional compliance data related to the transaction. */
  industryData?: EPaymentIndustryData;
  paymentMethod: EPaymentMethod;
  profile?: EPaymentProfileRequest;
  reference?: EPaymentReference;
  /**
   * The URL the user is returned to after the payment session.
   * The URL has to use the `https://` scheme or a custom URL scheme.
   * @example "https://example.com/redirect?orderId=acme-shop-123-order123abc"
   */
  returnUrl?: string;
  /**
   * The flow for bringing the user to the Vipps or MobilePay app's
   * payment confirmation screen.
   *
   * If `userFlow` is `PUSH_MESSAGE`, a valid value for `customer` is required.
   *
   * If `userFlow` is `WEB_REDIRECT`, a valid value for `returnUrl` is required.
   *
   * `WEB_REDIRECT` is the normal flow for browser-based payment flows.
   *
   * If on a mobile device, the Vipps or MobilePay app will open.
   * A valid value for `returnUrl` is required. Otherwise, the
   * [landing page](https://developer.vippsmobilepay.com/docs/knowledge-base/landing-page/)
   * will open.
   *
   * `NATIVE_REDIRECT` is for automatic app-switch between the merchant's
   * native app and the Vipps or MobilePay app.
   *
   * `PUSH_MESSAGE` is to skip the landing page for payments initiated on
   * a device other than the user's phone.
   *
   * The user gets a push message that opens the payment in the app. This
   * requires a valid `customer` field.
   *
   * `QR` returns a QR code that can be scanned to complete the payment.
   *
   * @example "NATIVE_REDIRECT"
   */
  userFlow: "PUSH_MESSAGE" | "NATIVE_REDIRECT" | "WEB_REDIRECT" | "QR";
  /**
   * The payment will expire at the given date and time.
   * The format must adhere to RFC 3339.
   * The value must be more than 10 minutes and less than 28 days in the future.
   * Can only be combined with `userFlow: PUSH_MESSAGE` or `userFlow: QR`.
   *
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
     *
     * @default "IMAGE/SVG+XML"
     * @example "IMAGE/SVG+XML"
     */
    format: "TEXT/TARGETURL" | "IMAGE/SVG+XML" | "IMAGE/PNG";
    /**
     * For example, if the value is 200, then 200x200 px is set as the dimension for the QR code.
     * This is only applicable when the format is set to `PNG`. If not set, the default is 1024.
     *
     * @min 100
     * @max 2000
     * @example 1024
     */
    size?: number | null;
  };
  /**
   * The payment description summary that will be provided to the user through the app,
   * the merchant portal, and the settlement files.
   *
   * @minLength 3
   * @maxLength 100
   */
  paymentDescription?: string;
  receipt?: EPaymentReceipt;
  metadata?: EPaymentMetadata;
};

export type EPaymentAmount = {
  /**
   * Currency code as defined in ISO 4217. eg NOK for Norwegian kroner.
   * @example "NOK"
   */
  currency: EPayementCurrency;
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

export type EPayementCurrency = "NOK" | "DKK" | "EUR";

/**
 * The target customer if the identity is known.
 *
 * The customer can be specified either with phone number,
 * the customer token or with the user's personal QR code
 *
 * Specifying more than one of these will result in an error.
 */
export type EPaymentCustomer =
  | EPaymentCustomerPhoneNumber
  | EPaymentPersonalQrCode
  | CustomerToken;

/**
 * The customer's phone number, if available.
 *
 * **Please note:** The phone number (and QR code) is optional and should
 * only be sent if it is already known. Users should never be asked for the
 * phone number, as they will either be automatically app-switched to the
 * Vipps or MobilePay app, or they will be presented with the landing page.
 *
 * The exception for this is "manual POS"integration, where the cashier asks
 * the customer for the number, and then enters it manually on the POS.
 *
 * If the customer's phone number is needed by the merchant, use `scope`
 * and the [Userinfo API](https://developer.vippsmobilepay.com/docs/APIs/userinfo-api/).
 *
 * See also [Landing page](https://developer.vippsmobilepay.com/docs/knowledge-base/landing-page/).
 */
export type EPaymentCustomerPhoneNumber = {
  /**
   * The phone number of the user paying the transaction with Vipps MobilePay.
   *
   * The format is MSISDN: Digits only: Country code and subscriber number, but no prefix.
   *
   * If the phone number is a Norwegian phone number `(+47) 91 23 45 67`,
   * the MSISDN representation is `4791234567`. See: https://en.wikipedia.org/wiki/MSISDN
   *
   * @minLength 10
   * @maxLength 15
   * @pattern ^\d{10,15}$
   * @example 4791234567
   */
  phoneNumber: string;
};

/**
 * The full content of the user's personal QR code in the app, used in 'merchant scan' scenarios.
 *
 * After the personal QR code has been scanned in a physical context, send the complete QR
 * code content in this field to initiate a payment from the user (and do not send `phoneNumber`).
 *  **Important:** The content of the QR code can change at any time, without warning.
 *
 * It is very important to send the _complete content of the QR code_,
 * like the complete URL in the example below.
 *
 * While the personal QR code does reveal the user's phone number in this example, that may change.
 *
 * The [Userinfo API](https://developer.vippsmobilepay.com/docs/APIs/userinfo-api/)
 * should be used if you need the user to share personal information, such as phone number, email address, etc.
 */
export type EPaymentPersonalQrCode = {
  /**
   * The full content of the user's personal QR code in the app.
   * @minLength 5
   * @maxLength 255
   * @example https://qr.vipps.no/28/2/01/031/4791234567?v=1
   */
  personalQr: string;
};

/**
 * The customer's token, if it is available. This token will be sent as part of
 * the user.checked-in.v1 webhook event when a user scans a merchant callback QR
 */
export type CustomerToken = {
  /**
   * A distinct token per customer
   * @example ey%382jf8+qk3nnfdsao0i5jlalidugujnakgo9t8ghn
   */
  customerToken: string;
};

/** Additional compliance data related to the transaction. */
export type EPaymentIndustryData = {
  /**
   * Airline related data.
   * If present, `passengerName`, `airlineCode`, `airlineDesignatorCode`, and `agencyInvoiceNumber` are all required.
   */
  airlineData?: EPaymentAirlineData;
};

/**
 * AirlineData
 * Airline related data.
 * If present, `passengerName`, `airlineCode`, `airlineDesignatorCode`, and `agencyInvoiceNumber` are all required.
 */
export type EPaymentAirlineData = {
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

export type EPaymentMethod = {
  /**
   * The paymentMethod type to be performed.
   * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`.
   */
  type: EPaymentMethodType;
};

/**
 * The paymentMethod type to be performed.
 *
 * `WALLET` is a card used in the Vipps or MobilePay app.
 *
 * `CARD` is free-standing card payments, outside of the Vipps or MobilePay app.
 *
 * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`, as the card
 * payment can not be completed in the Vipps or MobilePay app.
 *
 * @example "WALLET"
 */
export type EPaymentMethodType = "WALLET" | "CARD";

export type EPaymentProfileRequest = {
  /**
   * A space-separated string list of the required user information
   * (e.g., "name phoneNumber") for the payment, in accordance with the
   * OpenID Connect specification.
   *
   * See the [Userinfo user guide](https://developer.vippsmobilepay.com/docs/APIs/userinfo-api/userinfo-api-guide#scope) for details.
   *
   * Possible values are:
   * - name
   * - address
   * - email
   * - phoneNumber
   * - birthDate
   * - nin
   *
   * @example "name phoneNumber"
   */
  scope: Scope;
};

/**
 * A reference
 *
 * @minLength 8
 * @maxLength 50
 * @pattern ^[a-zA-Z0-9-]{8,50}$
 * @example "reference-string"
 */
export type EPaymentReference = string;

/**
 * @example {
 * orderLines:
 *    name: socks
 *    id: '1234567890'
 *    totalAmount: 1000
 *    totalAmountExcludingTax: 800
 *    totalTaxAmount: 250
 *    taxPercentage: 25
 *    unitInfo:
 *      unitPrice: 0
 *      quantity: '0.822'
 *      quantityUnit: PCS
 *    discount: 0
 *    productUrl: https://example.com/store/socks
 *    isReturn: false
 *    isShipping: false
 * bottomLine:
 *    tipAmount: 0
 *    currency: NOK
 *    posId: string
 *    paymentSources:
 *      giftCard: 0
 *      card: 0
 *      voucher: 0
 *      cash: 0
 *    barcode:
 *      format: EAN-13
 *      data: '123456'
 *    receiptNumber: '1234567'
 */
export type EPaymentReceipt = {
  /**
   * Amounts are specified in minor units (i.e., integers with two trailing zeros).
   * For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @minItems 1
   */
  orderLines: EPaymentOrderLine[];
  bottomLine: EPaymentBottomLine;
};

/**
 * Amounts are specified in minor units (i.e., integers with two trailing
 *  zeros). For example: 10.00 EUR/NOK/DKK should be written as 1000.
 */
export type EPaymentOrderLine = {
  /** Name of the product in the order line. */
  name: string;
  /** The ID of the product or service. */
  id: string;
  /**
   * Total amount of the order line, including tax and discount.
   *
   * @example 1000
   */
  totalAmount: number;
  /**
   * The total amount of the order line, excluding tax.
   *
   * @example 800
   */
  totalAmountExcludingTax: number;
  /**
   * Total tax amount paid for the order line
   *
   * @example 250
   */
  totalTaxAmount: number;
  /**
   * The tax percentage of the order line.
   *
   * @example 25
   * @min 0
   * @max 100
   */
  taxPercentage: number;
  /** Optional. If no quantity info is provided the order line will default to 1 pcs */
  unitInfo?: EPaymentUnitInfo;
  /**
   * Total discount for the order line.
   *
   * @example 2000
   * @minimum 0
   */
  discount?: number | null;
  /**
   * Optional URL linking back to the product at the merchant.
   *
   * @example https://example.com/store/socks
   */
  productUrl?: string | null;
  /**
   * Flag for marking the order line as returned. This will make it count
   * negative towards all the sums in bottomLine.
   *
   * @default false
   * @example false
   */
  isReturn?: boolean | null;
  /**
   * Flag for marking the order line as a shipping line. This will be
   * shown differently in the app.
   *
   * @default false
   */
  isShipping?: boolean | null;
};

export type EPaymentUnitInfo = {
  /**
   * Total price per unit, including tax and excluding discount.
   *
   * @minimum 0
   */
  unitPrice: number | null;
  /**
   * Quantity given as a integer or fraction (only for cosmetics)
   *
   * @maxLength 10
   * @pattern ^\d+([\.]\d{1,8})?$
   * @example: '0.822'
   */
  quantity: string;
  quantityUnit?: EPaymentQuantityUnit;
};

/**
 * Available units for quantity. Will default to PCS if not set
 *
 * @example "KG"
 * @default "PCS"
 */
export type EPaymentQuantityUnit =
  | "PCS"
  | "KG"
  | "KM"
  | "MINUTE"
  | "LITRE"
  | "KWH"
  | null;

/**
 * Summary of the order. Total amount and total. Amounts are specified in
 * minor units (i.e., integers with two trailing zeros). For example: 10.00
 * EUR/NOK/DKK should be written as 1000.
 *
 * @example
 * {
 *  currency: NOK
 *  tipAmount: 0
 *  posId: vipps_pos_122
 *  paymentSources:
 *    card: 100
 *    giftCard: 50
 *  barcode:
 *    format: EAN-13
 *    data: '123456'
 *  receiptNumber: '1234567'
 * }
 */
export type EPaymentBottomLine = {
  currency: EPayementCurrency;
  /**
   * Tip amount in minor units (i.e., integers with two trailing zeros).
   * For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @example 2000
   * @minimum 0
   */
  tipAmount?: number | null;
  /**
   * POS ID is the device number of the POS terminal.
   *
   * @example "vipps_pos_122"
   */
  posId: string | null;
  paymentSources?: EPaymentSources;
  barcode?: EPaymentBarcode;
  /**
   * Receipt number from the POS.
   *
   * @example "1234567"
   */
  receiptNumber?: string | null;
};

/**
 * @example
 * {
 *  giftCard: 200
 *  card: 50
 *  voucher: 25
 *  cash: 25
 * }
 */
export type EPaymentSources = {
  giftCard?: number | null;
  card?: number | null;
  voucher?: number | null;
  cash?: number | null;
};

export type EPaymentBarcode = {
  format: EPaymentBarcodeFormat;
  data: string | null;
};

export type EPaymentBarcodeFormat = "EAN-13" | "CODE 39" | "QCODE 128";

export type EPaymentMetadata = {
  /**
   * Metadata is a key-value map that can be used to store additional
   * information about the payment.
   *
   * The metadata is not used by Vipps MobilePay, but is passed through in the
   * `GetPaymentResponse` object.
   *
   * Key length is limited to 100 characters,
   * and value length is limited to 500 characters.
   *
   * Max capacity is 5 key-value pairs.
   *
   * @minProperties 1
   * @maxProperties 5
   *
   * @example
   *  key1: value1
   *  key2: value2
   *  key3: value3
   */
  [key: string]: string;
} | null;

/////////////// Create Payment Response ///////////////

export type EPaymentCreatePaymentOKResponse = {
  redirectUrl: string;
  reference: string;
};

/////////////// Info Payment Response ///////////////

export type EPaymentGetPaymentOKResponse = {
  aggregate: EPaymentAggregate;
  amount: EPaymentAmount;
  state: EPaymentState;
  paymentMethod: EPaymentMethodResponse;
  profile: EPaymentProfileResponse;
  pspReference: string;
  /**
   * The URL you should redirect the user to to continue with the payment.
   *
   * This is the URL to the Vipps MobilePay landing page.
   *
   * See: https://developer.vippsmobilepay.com/docs/knowledge-base/landing-page/
   *
   * @example: https://landing.vipps.no?token=abc123
   */
  redirectUrl?: string;
  reference: EPaymentReference;
  metadata?: EPaymentMetadata;
};

export type EPaymentAggregate = {
  authorizedAmount: EPaymentAmount;
  cancelledAmount: EPaymentAmount;
  capturedAmount: EPaymentAmount;
  refundedAmount: EPaymentAmount;
};

/**
 * The state of the Payment.
 *
 * One of:
 * - `CREATED`: The user has not yet acted upon the payment.
 * Example: The user has received a push message, but not yet opened it.
 * - `ABORTED`: The user has aborted the payment before authorization. This is a final state.
 * Example: The user cancelled instead of accepting the payment.
 * - `EXPIRED`: The user did not act on the payment within the payment expiration time. This is a final state.
 * Example: The user received a push message, but did nothing before the payment request timed out.
 * - `AUTHORIZED`: The user has approved the payment. This is a final state.
 * Example: A payment that has been refunded may have one or more refund events, but the state would be `AUTHORIZED`.
 * - `TERMINATED`: The merchant has terminated the payment via the cancelPayment endpoint. This is a final state.
 * Example: The merchant was not able to provide the product or service, and has cancelled the payment.
 */
export type EPaymentState =
  | "CREATED"
  | "ABORTED"
  | "EXPIRED"
  | "AUTHORIZED"
  | "TERMINATED";

export type EPaymentMethodResponse = {
  /**
   * The paymentMethod type to be performed.
   * `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`.
   */
  type: EPaymentMethodType;
  /**
   * The payment card's Bank Identification Number (BIN),
   * that identifies which bank has issued the card.
   *
   * @minLength 6
   * @maxLength 6
   * @example "540185"
   */
  cardBin?: string;
};

export type EPaymentProfileResponse = {
  /**
   * If `profile.scope` was requested in `createPayment` this value will populate once
   * `state` is `AUTHORIZED`. This can be used towards the
   * [Userinfo endpoint](https://developer.vippsmobilepay.com/api/userinfo#operation/getUserinfo)
   * to fetch requested user data.
   */
  sub?: string;
};

/////////////// Payment Event History Response ///////////////

export type EPaymentGetEventLogOKResponse = EPaymentEvent[];

export type EPaymentEvent = {
  reference: EPaymentReference;
  pspReference: string;
  name: EPaymentEventName;
  amount: EPaymentAmount;
  /**
   * @example: '2022-12-31T00:00:00Z'
   */
  timestamp: string;
  /**
   * The idempotency key of the request.
   * Specified by the merchant/partner making the API request.
   *
   * @maxLength 50
   * @example fb492b5e-7907-4d83-ba20-c7fb60ca35de
   */
  idempotencyKey?: string | null;
  /** The outcome of the event */
  success: boolean;
};

export type EPaymentWebhookEvent = {
  msn: MerchantSerialNumber;
} & EPaymentEvent;

export type EPaymentEventName =
  | "CREATED"
  | "ABORTED"
  | "EXPIRED"
  | "CANCELLED"
  | "CAPTURED"
  | "REFUNDED"
  | "AUTHORIZED"
  | "TERMINATED";

/////////////// Adjust Payments Request ///////////////

export type EPaymentModificationRequest = {
  modificationAmount: EPaymentAmount;
};

/////////////// Adjust Payments Response ///////////////
export type EPaymentModificationOKResponse = {
  amount: EPaymentAmount;
  state: EPaymentState;
  aggregate: EPaymentAggregate;
  pspReference: string;
  reference: EPaymentReference;
};

/////////////// Force Approve Payments ///////////////
export type EPaymentForceApproveRequest = {
  customer?: EPaymentCustomer;
  /** The token value received in the redirectUrl property in the Create payment response */
  token?: string;
};

import type { MerchantSerialNumber } from "../../types.ts";
import type { ProblemJSON } from "./shared_types.ts";

/////////////// Error Types ///////////////
export type CheckoutErrorResponse = ProblemJSON & {
  errorCode: string;
  errors: Record<string, string[]>;
};

/**
 * The currency identifier according to ISO 4217.
 * Available types of currency are NOK and EUR.
 *
 * @example "NOK"
 */
export type CheckoutCurrency = "NOK";

/**
 * Amounts are specified in minor units. For example: 10.00 NOK should be
 * written as 1000; 20.50 EUR should be written as 2050.
 */
export type CheckoutAmount = {
  /**
   * Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int32
   * @min 0
   */
  value: number;
  /** The currency identifier according to ISO 4217. Example: "NOK" */
  currency: CheckoutCurrency;
};

/** Defines the details of the billing */
export type CheckoutBillingDetails = {
  /** Example: "Ada" */
  firstName: string;
  /** Example: "Lovelace" */
  lastName: string;
  /** Example: "user@example.com" */
  email: string;
  /** If no country code is provided, defaults to Norway (47). Example: "4791234567" */
  phoneNumber: string;
  /** Example: "Robert Levins gate 5" */
  streetAddress?: string | null;
  /** Example: "0154" */
  postalCode?: string | null;
  /** Example: "Oslo" */
  city?: string | null;
  /** The ISO-3166-1 Alpha-2 representation of the country. Example: "NO" */
  country?: string | null;
};

export type CheckoutConfig = {
  /** If customer is physically present: "customer_present", otherwise: "customer_not_present". */
  customerInteraction?: CheckoutCustomerInteraction | null;
  /** Adjust the fields and values present in the Checkout. */
  elements?: CheckoutElements | null;
  /** Countries to allow during session */
  countries?: CheckoutCountries | null;
  /** One of the following: "WEB_REDIRECT", "NATIVE_REDIRECT". To ensure having a return URL based on an app URL, use "NATIVE_REDIRECT". */
  userFlow?: CheckoutUserFlow | null;
  /** Requires the customer to consent to share their email and openid sub with the merchant to be able to make a wallet payment (default: false). */
  requireUserInfo?: boolean | null;
  /** If used, displays a checkbox that can be used to ask for extra consent. */
  customConsent?: CheckoutCustomConsent | null;
  /** Decides whether the order lines are displayed as a shopping cart context in the checkout. */
  showOrderSummary?: boolean | null;
};

export type CheckoutCountries = {
  /** List of allowed countries in ISO-3166 Alpha 2. If specified, the customer will only be able to select these countries. Example ["NO", "SE", "DK"] */
  supported: string[];
};

/** If used, displays a checkbox that can be used to ask for extra consent. */
export type CheckoutCustomConsent = {
  /** Text displayed next to the checkbox. This text can contain up to one link in markdown format like this: [linkText](https://example.com) */
  text: string;
  /** Whether box has to be checked to complete the checkout. */
  required: boolean;
};

export type CheckoutCustomerInteraction =
  | "CUSTOMER_PRESENT"
  | "CUSTOMER_NOT_PRESENT";

export type CheckoutElements = "Full" | "PaymentAndContactInfo" | "PaymentOnly";

export type CheckoutExternalSessionState =
  | "SessionCreated"
  | "PaymentInitiated"
  | "SessionExpired"
  | "PaymentSuccessful"
  | "PaymentTerminated";

/** Configuration required to enable Helthjem logistics options */
export type CheckoutHelthjem = {
  /**
   * The Username provided to you by Helthjem
   * @minLength 1
   */
  username: string;
  /**
   * The Password provided to you by Helthjem
   * @minLength 1
   */
  password: string;
  /**
   * The ShopId provided to you by Helthjem
   * @format int32
   */
  shopId: number;
};

export type CheckoutHelthjemLogisticsOption = CheckoutLogisticsOptionBase & {
  type?: CheckoutHelthjemLogisticsType | null;
  customType?: string | null;
  brand: "HELTHJEM";
};

export type CheckoutHelthjemLogisticsType = "HOME_DELIVERY" | "PICKUP_POINT";

/** Request to set up a Checkout session */
export type CheckoutInitiateSessionRequest = {
  merchantInfo: CheckoutPaymentMerchantInfo;
  transaction: CheckoutPaymentTransaction;
  logistics?: CheckoutLogistics | null;
  /** If customer information is known, it can be prefilled. */
  prefillCustomer?: CheckoutPrefillCustomer | null;
  configuration?: CheckoutConfig | null;
};

/** Response from initiating a session. */
export type CheckoutInitiateSessionOKResponse = {
  /** The token to be provided to Checkout. Example: "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJUdHF1Y3I5ZDdKRHZ6clhYWTU1WUZRIiwic2Vzc2lvblBvbGxpbmdVUkwiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAvY2hlY2tvdXQvc2Vzc2lvbi9UdHF1Y3I5ZDdKRHZ6clhYWTU1WUZRIn0.ln7VzZkNvUGu0HhyA_a8IbXQN35WhDBmCYC9IvyYL-I" */
  token: string;
  /** The URL of the checkout frontend. Example: "https://vippscheckout.vipps.no/v1/". */
  checkoutFrontendUrl: string;
  /** The URL to poll for session information. Example: "https://api.vipps.no/checkout/v1/session/31gf1g413121". */
  pollingUrl: string;
};

export type CheckoutIntegrations = {
  /** Configuration required to enable Porterbuddy logistics options */
  porterbuddy?: CheckoutPorterbuddy | null;
  /** Configuration required to enable Helthjem logistics options */
  helthjem?: CheckoutHelthjem | null;
};

/**
 * If both dynamic and fixed options are specified, dynamic options is provided to the user.
 * If no DynamicOptionsCallback is provided, only fixed logistics options will be used.
 * When using dynamic shipping we recommend that you define logistics.fixedOptions as a backup.
 * If the callback does not resolve successfully within 8 seconds, returns null or an empty list the system will fall back to static options.
 * If no fallback options are provided, the user will be presented with an error and will not be able to continue with the checkout.
 */
export type CheckoutLogistics = {
  /** Merchant's Callback URL for providing dynamic logistics options based on customer address. Example: "https://example.com/vipps/dynamiclogisticsoption". Can not be used with AddressFields set to false. */
  dynamicOptionsCallback?: string | null;
  /** Fixed list of logistics options. */
  fixedOptions?:
    | (
      | CheckoutPostenLogisticsOption
      | CheckoutPostnordLogisticsOption
      | CheckoutPorterbuddyLogisticsOption
      | CheckoutHelthjemLogisticsOption
      | CheckoutPostiLogisticsOption
      | CheckoutOtherLogisticsOption
    )[]
    | null;
  /** Some optional checkout features require carrier-specific configuration. Can not be used with AddressFields set to false. */
  integrations?: CheckoutIntegrations | null;
};

export type CheckoutLogisticsOptionBase = {
  /**
   * @minLength 1
   * @maxLength 200
   */
  id: string;
  /**
   * @format int32
   * @min 0
   */
  priority: number;
  isDefault: boolean;
  description?: string | null;
};

/** Information about the customer address used when retrieving dynamic logistics options. */
export type CheckoutMerchantLogisticsCallbackRequestBody = {
  /** Example: "Robert Levins gate 5" */
  streetAddress: string;
  /** Example: "0154" */
  postalCode: string;
  /** Example: "Oslo" */
  region: string;
  /** The ISO-3166-1 Alpha-2 representation of the country. Example: "NO" */
  country: string;
};

export type CheckoutOrderBottomLine = {
  /**
   * The currency identifier according to ISO 4217. Example: "NOK".
   * @minLength 3
   * @maxLength 3
   */
  currency: CheckoutCurrency;
  /**
   * Tip amount for the order. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   */
  tipAmount?: number | null;
  /**
   * Amount paid by gift card or coupon. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   */
  giftCardAmount?: number | null;
  /** Identifier of the terminal / point of sale. */
  terminalId?: string | null;
  /** May be used to indicate that the payment comes from multiple sources. Example: giftcard + card */
  paymentSources?: CheckoutPaymentSources | null;
  receiptNumber?: string | null;
};

export type CheckoutOrderLine = {
  /**
   * The name of the product in the order line.
   * @minLength 1
   * @maxLength 2048
   */
  name: string;
  /**
   * The product ID.
   * @minLength 1
   * @maxLength 255
   */
  id: string;
  /**
   * Total amount of the order line, including tax and discount. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  totalAmount: number;
  /**
   * Total amount of order line with discount excluding tax. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  totalAmountExcludingTax: number;
  /**
   * Total tax amount paid for the order line. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  totalTaxAmount: number;
  /**
   * Tax percentage for the order line.
   * @format int32
   * @min 0
   * @max 100
   */
  taxPercentage: number;
  /** If no quantity info is provided the order line will default to 1 pcs. */
  unitInfo?: CheckoutOrderUnitInfo | null;
  /**
   * Total discount for the order line. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   */
  discount?: number | null;
  /** URL linking back to the product at the merchant. */
  productUrl?: string | null;
  /** Flag for marking the orderline as returned. This will make it count negative towards all the sums in BottomLine. */
  isReturn?: boolean | null;
  /** Flag for marking the orderline as a shipping line. This will be shown differently in the app. */
  isShipping?: boolean | null;
};

export type CheckoutOrderSummary = {
  /**
   * The order lines contain descriptions of each item present in the order.
   * @minItems 1
   */
  orderLines: CheckoutOrderLine[];
  /** Contains information regarding the order as a whole. */
  orderBottomLine: CheckoutOrderBottomLine;
};

export type CheckoutOrderUnitInfo = {
  /**
   * Total price per unit, including tax and excluding discount. Must be in minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  unitPrice: number;
  /** Quantity given as a integer or fraction (only for cosmetics). */
  quantity: string;
  /** Available units for quantity. Will default to PCS if not set. */
  quantityUnit: CheckoutQuantityUnit;
};

export type CheckoutOtherLogisticsOption = CheckoutLogisticsOptionBase & {
  /**
   * @minLength 1
   * @maxLength 200
   */
  title: string;
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
  brand: "OTHER";
};

export type CheckoutPaymentMerchantInfo = {
  /** Complete URL for receiving callbacks. Example: "https://exmaple.com/vipps/payment-callback/ */
  callbackUrl: string;
  /**
   * Complete URL for redirecting customers to when the checkout is finished. Example: "https://example.com/vipps".
   * @minLength 1
   */
  returnUrl: string;
  /** The token will be supplied by the callback to the merchant as a header. Example: "iOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJ". */
  callbackAuthorizationToken: string;
  /** Complete URL to the merchant's terms and conditions. Example: "https://example.com/vipps/termsAndConditions". */
  termsAndConditionsUrl?: string | null;
};

export type CheckoutPaymentMethod = "Wallet" | "Card" | "BankTransfer";

export type CheckoutPaymentSources = {
  /**
   * Amount from gift card
   * @format int64
   */
  giftCard?: number | null;
  /**
   * Amount from card
   * @format int64
   */
  card?: number | null;
  /**
   * Amount from voucher
   * @format int64
   */
  voucher?: number | null;
  /**
   * Amount from cash
   * @format int64
   */
  cash?: number | null;
};

export type CheckoutPaymentState = "CREATED" | "AUTHORIZED" | "TERMINATED";

export type CheckoutPaymentTransaction = {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
  /**
   * The merchant's unique reference for the transaction. Also known as OrderId. Example: "acme-shop-123-order123abc". See https://vippsas.github.io/vipps-developer-docs/docs/vipps-developers/common-topics/orderid
   * @minLength 8
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9]*$
   */
  reference: string;
  /**
   * Description visible to the customer during payment. Example: "One pair of socks".
   * @minLength 3
   * @maxLength 100
   */
  paymentDescription: string;
  /** Contain descriptions of each item present in the order, and an order bottom line for information regarding the order as a whole. */
  orderSummary?: CheckoutOrderSummary | null;
};

/** The pickup point the customer selected . */
export type CheckoutPickupPoint = {
  /** Pickup point id provided by the carrier. Example: 121648 */
  id: string;
  /** Pickup point name. Example: Extra Eiganes */
  name: string;
  /** Pickup point's street address. Example: VITAMINVEIEN 7 */
  address: string;
  /** Pickup point's postal code. Example: 0485 */
  postalCode: string;
  /** Pickup point's city. Example: OSLO */
  city: string;
  /** Pickup point's country. Example: NO */
  country: string;
  /** Pickup point's opening hours. Example: Man-Søn: 1000-2000 */
  openingHours?: string[] | null;
};

/** Configuration required to enable Porterbuddy logistics options */
export type CheckoutPorterbuddy = {
  /** The public key provided to you by Porterbuddy */
  publicToken: string;
  /**
   * The API key provided to you by Porterbuddy
   * @minLength 1
   */
  apiKey: string;
  /** Information about the sender */
  origin: CheckoutPorterbuddyOrigin;
};

export type CheckoutPorterbuddyLogisticsOption = CheckoutLogisticsOptionBase & {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount?: CheckoutAmount | null;
  type?: CheckoutPorterbuddyLogisticsType | null;
  customType?: string | null;
  brand: "PORTERBUDDY";
};

export type CheckoutPorterbuddyLogisticsType = "HOME_DELIVERY";

/** Details about the sender of the Porterbuddy parcels */
export type CheckoutPorterbuddyOrigin = {
  /** The name of your store */
  name: string;
  /** Your email address where Porterbuddy booking confirmation will be sent */
  email: string;
  /** Your phone number where Porterbuddy may send you important messages. Format must be MSISDN (including country code). Example: "4791234567" */
  phoneNumber: string;
  /** Your address where Porterbuddy will pick up the parcels */
  address: CheckoutPorterbuddyOriginAddress;
};

export type CheckoutPorterbuddyOriginAddress = {
  /** Example: "Robert Levins gate 5" */
  streetAddress: string;
  /** Example: "0154" */
  postalCode: string;
  /** Example: "Oslo" */
  city: string;
  /** The ISO-3166-1 Alpha-2 representation of the country. Example: "NO" */
  country: string;
};

export type CheckoutPostenLogisticsOption = CheckoutLogisticsOptionBase & {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
  type?: CheckoutPostenLogisticsType | null;
  customType?: string | null;
  brand: "POSTEN";
};

export type CheckoutPostenLogisticsType =
  | "MAILBOX"
  | "PICKUP_POINT"
  | "HOME_DELIVERY";

export type CheckoutPostiLogisticsOption = CheckoutLogisticsOptionBase & {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
  type?: CheckoutPostiLogisticsType | null;
  customType?: string | null;
  /**
   * @default "POSTI"
   * @pattern POSTI
   */
  brand: "POSTI";
};

export type CheckoutPostiLogisticsType = "MAILBOX" | "PICKUP_POINT";

export type CheckoutPostnordLogisticsOption = CheckoutLogisticsOptionBase & {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
  type?: CheckoutPostnordLogisticsType | null;
  customType?: string | null;
  brand: "POSTNORD";
};

export type CheckoutPostnordLogisticsType = "PICKUP_POINT" | "HOME_DELIVERY";

/**
 * Information about the customer to be prefilled
 *
 * If any of the customer information is invalid such as the phone number,
 * the customer will be prompted to input new user information.
 */
export type CheckoutPrefillCustomer = {
  /** Example: "Ada" */
  firstName?: string;
  /** Example: "Lovelace" */
  lastName?: string;
  /** Example: "user@example.com" */
  email?: string;
  /** Format must be MSISDN (including country code). Example: "4791234567" */
  phoneNumber?: string;
  /** Example: "Robert Levins gate 5" */
  streetAddress?: string;
  /** Example: "Oslo" */
  city?: string;
  /** Example: "0154" */
  postalCode?: string;
  /** The ISO-3166-1 Alpha-2 representation of the country. Example: "NO" */
  country?: string;
};

export type CheckoutQuantityUnit = "PCS" | "KG" | "KM" | "MINUTE" | "LITRE";

/** Defines the details of a bank transfer payment. */
export type CheckoutResponseBankTransferPaymentDetails =
  & CheckoutResponsePaymentDetailsBase
  & {
    /**
     * @default "BankTransfer"
     * @pattern BankTransfer
     */
    type: "BankTransfer";
  };

/** Defines the details of a card payment. */
export type CheckoutResponseCardPaymentDetails =
  & CheckoutResponsePaymentDetailsBase
  & {
    state: CheckoutPaymentState;
    aggregate?: CheckoutTransactionAggregate | null;
    /**
     * @default "Card"
     * @pattern Card
     */
    type: "Card";
  };

export type CheckoutResponsePaymentDetailsBase = {
  /** Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050. */
  amount: CheckoutAmount;
};

/** Defines the details of a wallet payment. */
export type CheckoutResponseWalletPaymentDetails =
  & CheckoutResponsePaymentDetailsBase
  & {
    state: CheckoutPaymentState;
    aggregate?: CheckoutTransactionAggregate | null;
    /**
     * @default "Wallet"
     * @pattern Wallet
     */
    type: "Wallet";
  };

/** Session information */
export type CheckoutSessionResponse = {
  /** The Id of the session. Example: "v52EtjZriRmGiKiAKHByK2". */
  sessionId: string;
  merchantSerialNumber?: MerchantSerialNumber | null;
  /** The merchant's unique reference for the transaction. Also known as OrderId. Example: "acme-shop-123-order123abc". See https://vippsas.github.io/vipps-developer-docs/docs/vipps-developers/common-topics/orderid */
  reference: string;
  /** The state of the session. Example: "SessionStarted". The state of the payment is in PaymentDetails.State. */
  sessionState: CheckoutExternalSessionState;
  paymentMethod?: CheckoutPaymentMethod | null;
  paymentDetails?:
    | CheckoutResponseWalletPaymentDetails
    | CheckoutResponseCardPaymentDetails
    | CheckoutResponseBankTransferPaymentDetails
    | null;
  userInfo?: CheckoutUserInfo | null;
  shippingDetails?: CheckoutShippingDetails | null;
  billingDetails?: CheckoutBillingDetails | null;
  customConsentProvided?: boolean | null;
};

/** Defines the details of the shipping */
export type CheckoutShippingDetails = {
  /** Example: "Ada" */
  firstName?: string | null;
  /** Example: "Lovelace" */
  lastName?: string | null;
  /** Example: "user@example.com" */
  email?: string | null;
  /** If no country code is provided, defaults to Norway (47). Example: "4791234567" */
  phoneNumber?: string | null;
  /** Example: "Robert Levins gate 5" */
  streetAddress?: string | null;
  /** Example: "0154" */
  postalCode?: string | null;
  /** Example: "Oslo" */
  city?: string | null;
  /** The ISO-3166-1 Alpha-2 representation of the country. Example: "NO" */
  country?: string | null;
  /** Id of the shipping method. Example: "123abc" */
  shippingMethodId?: string | null;
  pickupPoint?: CheckoutPickupPoint | null;
};

/** Defines the details of the transaction */
export type CheckoutTransactionAggregate = {
  cancelledAmount?: CheckoutAmount | null;
  capturedAmount?: CheckoutAmount | null;
  refundedAmount?: CheckoutAmount | null;
  authorizedAmount?: CheckoutAmount | null;
};

export type CheckoutUserFlow = "WEB_REDIRECT" | "NATIVE_REDIRECT";

/** Data from the UserInfo endpoint. Will only be present if UserInfo flow is used. */
export type CheckoutUserInfo = {
  /** The openid sub that uniquely identifies a user. */
  sub: string;
  /** Example: "user@example.com" */
  email?: string | null;
};

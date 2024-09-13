// This file is auto-generated by @hey-api/openapi-ts

/**
 * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
 */
export type Amount = {
  /**
   * Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  value: number;
  /**
   * The currency identifier according to ISO 4217. Example: "NOK"
   */
  currency: string;
};

/**
 * Defines the details of the billing
 */
export type BillingDetails = {
  /**
   * Example: "Ada"
   */
  firstName: string;
  /**
   * Example: "Lovelace"
   */
  lastName: string;
  /**
   * Example: "user@example.com"
   */
  email: string;
  /**
   * If no country code is provided, defaults to Norway (47). Example: "4712345678"
   */
  phoneNumber: string;
  /**
   * Example: "Robert Levins gate 5"
   */
  streetAddress?: (string) | null;
  /**
   * Example: "0154"
   */
  postalCode?: (string) | null;
  /**
   * Example: "Oslo"
   */
  city?: (string) | null;
  /**
   * The ISO-3166-1 Alpha-2 representation of the country. Example: "NO"
   */
  country?: (string) | null;
};

export type CheckoutConfig = {
  /**
   * If customer is physically present: "customer_present", otherwise: "customer_not_present".
   */
  customerInteraction?: (CustomerInteraction) | null;
  /**
   * Adjust the fields and values present in the Checkout.
   */
  elements?: (Elements) | null;
  /**
   * Countries to allow during session
   */
  countries?: (Countries) | null;
  /**
   * One of the following: "WEB_REDIRECT", "NATIVE_REDIRECT". To ensure having a return URL based on an app URL, use "NATIVE_REDIRECT".
   */
  userFlow?: (UserFlow) | null;
  /**
   * Requires the customer to consent to share their email and openid sub with the merchant to be able to make a wallet payment (default: false).
   */
  requireUserInfo?: (boolean) | null;
  /**
   * If used, displays a checkbox that can be used to ask for extra consent.
   */
  customConsent?: (CustomConsent) | null;
  /**
   * Decides whether the order lines are displayed as a shopping cart context in the checkout.
   */
  showOrderSummary?: (boolean) | null;
  /**
   * External payment methods to be enabled in the checkout.
   */
  externalPaymentMethods?: Array<ExternalPaymentMethod> | null;
};

/**
 * A machine-readable format for specifying errors in HTTP API responses based on <see href="https://tools.ietf.org/html/rfc7807" />.
 */
export type CheckoutProblemDetails = {
  type?: (string) | null;
  title?: (string) | null;
  status?: (number) | null;
  detail?: (string) | null;
  instance?: (string) | null;
  errorCode: string;
  errors: {
    [key: string]: Array<(string)>;
  };
  [key: string]: (unknown | string | number) | undefined;
};

/**
 * Information about the merchant system.
 */
export type CheckoutSessionThirdPartyInformationHeaders = {
  /**
   * The name of the ecommerce solution. Example: "Acme Commerce".
   */
  "vipps-System-Name": string;
  /**
   * The version number of the ecommerce solution. Example: "3.1.2".
   */
  "vipps-System-Version": string;
  /**
   * The name of the ecommerce plugin. Example: "acme-webshop".
   */
  "vipps-System-Plugin-Name": string;
  /**
   * The version number of the ecommerce plugin. Example: "4.5.6".
   */
  "vipps-System-Plugin-Version": string;
};

export type Countries = {
  /**
   * List of allowed countries in ISO-3166 Alpha 2. If specified, the customer will only be able to select these countries. Example ["NO", "SE", "DK"]
   */
  supported: Array<(string)>;
};

/**
 * If used, displays a checkbox that can be used to ask for extra consent.
 */
export type CustomConsent = {
  /**
   * Text displayed next to the checkbox. This text can contain up to one link in markdown format like this: [linkText](https://example.com)
   */
  text: string;
  /**
   * Whether box has to be checked to complete the checkout.
   */
  required: boolean;
};

export type CustomerInteraction = "CUSTOMER_PRESENT" | "CUSTOMER_NOT_PRESENT";

export type DaoLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (DaoLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type DaoLogisticsType = number;

export type Elements = "Full" | "PaymentAndContactInfo" | "PaymentOnly";

export type EventSubscriptionCampaign = SubscriptionCampaign & {
  eventDate: string;
  eventText: string;
  type: string;
};

/**
 * Configuration for showing and enabling external payment methods in the checkout.
 */
export type ExternalPaymentMethod = {
  /**
   * Identifier for the payment method, needs to match that of the allowed list defined in the docs
   */
  paymentMethod: ExternalPaymentMethodType;
  /**
   * URL to redirect the customer to finish the payment
   */
  redirectUrl: string;
};

/**
 * Valid types of external payment methods
 */
export type ExternalPaymentMethodType = "Klarna";

export type ExternalSessionState =
  | "SessionCreated"
  | "PaymentInitiated"
  | "SessionExpired"
  | "PaymentSuccessful"
  | "PaymentTerminated";

export type GlsLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (GlsLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type GlsLogisticsType = "PICKUP_POINT";

/**
 * Configuration required to enable Helthjem logistics options
 */
export type Helthjem = {
  /**
   * The Username provided to you by Helthjem
   */
  username: string;
  /**
   * The Password provided to you by Helthjem
   */
  password: string;
  /**
   * The ShopId provided to you by Helthjem
   */
  shopId: number;
};

export type HelthjemLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (HelthjemLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type HelthjemLogisticsType = "HOME_DELIVERY" | "PICKUP_POINT";

export type IdempotencyHeader = {
  "idempotency-Key"?: (string) | null;
};

/**
 * Request to set up a Checkout session
 */
export type InitiatePaymentSessionRequest = InitiateSessionRequestBase & {
  transaction: PaymentTransaction;
  logistics?: (Logistics) | null;
  type: string;
};

export type InitiateSessionRequestBase = {
  /**
   * Information about the customer to be prefilled
   *
   * If any of the customer information is invalid such as the phone number,
   * the customer will be prompted to input new user information.
   */
  prefillCustomer?: (PrefillCustomer) | null;
  merchantInfo: MerchantInfo;
  configuration?: (CheckoutConfig) | null;
};

/**
 * Response from initiating a session.
 */
export type InitiateSessionResponse = {
  /**
   * The token to be provided to Checkout. Example: "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJUdHF1Y3I5ZDdKRHZ6clhYWTU1WUZRIiwic2Vzc2lvblBvbGxpbmdVUkwiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAvY2hlY2tvdXQvc2Vzc2lvbi9UdHF1Y3I5ZDdKRHZ6clhYWTU1WUZRIn0.ln7VzZkNvUGu0HhyA_a8IbXQN35WhDBmCYC9IvyYL-I"
   */
  token: string;
  /**
   * The URL of the checkout frontend. Example: "https://vippscheckout.vipps.no/v1/".
   */
  checkoutFrontendUrl: string;
  /**
   * The URL to poll for session information. Example: "https://api.vipps.no/checkout/v1/session/31gf1g413121".
   */
  pollingUrl: string;
};

/**
 * Request to set up a Recurring Checkout session
 */
export type InitiateSubscriptionSessionRequest = InitiateSessionRequestBase & {
  /**
   * Required when no Transaction is present. This is the merchant's unique reference to the Checkout Session (as well as the optional payment transaction)
   */
  reference?: (string) | null;
  /**
   * Defines a one-time-payment
   */
  transaction?: (PaymentTransaction) | null;
  /**
   * Defines a subscription. Used for future payments.
   */
  subscription: Subscription;
  type: string;
};

export type Integrations = {
  /**
   * Configuration required to enable Porterbuddy logistics options
   */
  porterbuddy?: (Porterbuddy) | null;
  /**
   * Configuration required to enable Helthjem logistics options
   */
  helthjem?: (Helthjem) | null;
};

export type Interval = {
  unit: IntervalUnit;
  count: number;
};

export type IntervalUnit = "YEAR" | "MONTH" | "WEEK" | "DAY";

/**
 * If both dynamic and fixed options are specified, dynamic options is provided to the user.
 * If no DynamicOptionsCallback is provided, only fixed logistics options will be used.
 * When using dynamic shipping we recommend that you define logistics.fixedOptions as a backup.
 * If the callback does not resolve successfully within 8 seconds, returns null or an empty list the system will fall back to static options.
 * If no fallback options are provided, the user will be presented with an error and will not be able to continue with the checkout.
 */
export type Logistics = {
  /**
   * Merchant's Callback URL for providing dynamic logistics options based on customer address. Example: "https://example.com/vipps/dynamiclogisticsoption". Can not be used with AddressFields set to false.
   */
  dynamicOptionsCallback?: (string) | null;
  /**
   * Fixed list of logistics options.
   */
  fixedOptions?:
    | Array<
      (
        | PostenLogisticsOption
        | PostnordLogisticsOption
        | PorterbuddyLogisticsOption
        | HelthjemLogisticsOption
        | PostiLogisticsOption
        | GlsLogisticsOption
        | DaoLogisticsOption
        | OtherLogisticsOption
      )
    >
    | null;
  /**
   * Some optional checkout features require carrier-specific configuration. Can not be used with AddressFields set to false.
   */
  integrations?: (Integrations) | null;
};

export type LogisticsOptionBase = {
  id: string;
  priority: number;
  isDefault: boolean;
  description?: (string) | null;
};

/**
 * Headers required to retrieve an access token.
 */
export type MerchantAuthInfoHeaders = {
  /**
   * Client ID for the merchant (the "username"). See [API keys](/docs/knowledge-base/api-keys/).
   */
  client_id: string;
  /**
   * Client Secret for the merchant (the "password"). See [API keys](/docs/knowledge-base/api-keys/).
   */
  client_secret: string;
  /**
   * Subscription key for the API product. See [API keys](/docs/knowledge-base/api-keys/).
   */
  "ocp-Apim-Subscription-Key": string;
  /**
   * Assigned unique number for a merchant. See [API keys](/docs/knowledge-base/api-keys/).
   */
  "merchant-Serial-Number": string;
};

export type MerchantInfo = {
  /**
   * Complete URL for receiving callback after payment is completed. Example: "https://exmaple.com/vipps/payment-callback/oS1d5f9abD
   */
  callbackUrl: string;
  /**
   * Complete URL for redirecting customers to when the checkout is finished. Example: "https://example.com/vipps".
   */
  returnUrl: string;
  /**
   * The token will be supplied by the callback to the merchant as a header. Example: "iOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJ".
   */
  callbackAuthorizationToken: string;
  /**
   * Complete URL to the merchant's terms and conditions. Example: "https://example.com/vipps/termsAndConditions".
   */
  termsAndConditionsUrl?: (string) | null;
};

/**
 * Information about the customer address used when retrieving dynamic logistics options.
 */
export type MerchantLogisticsCallbackRequestBody = {
  /**
   * Example: "Robert Levins gate 5"
   */
  streetAddress: string;
  /**
   * Example: "0154"
   */
  postalCode: string;
  /**
   * Example: "Oslo"
   */
  region: string;
  /**
   * The ISO-3166-1 Alpha-2 representation of the country. Example: "NO"
   */
  country: string;
};

export type OrderBottomLine = {
  /**
   * The currency identifier according to ISO 4217. Example: "NOK".
   */
  currency: string;
  /**
   * Tip amount for the order. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  tipAmount?: (number) | null;
  /**
   * Amount paid by gift card or coupon. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  giftCardAmount?: (number) | null;
  /**
   * Identifier of the terminal / point of sale.
   */
  terminalId?: (string) | null;
  /**
   * May be used to indicate that the payment comes from multiple sources. Example: giftcard + card
   */
  paymentSources?: (PaymentSources) | null;
  receiptNumber?: (string) | null;
};

export type OrderLine = {
  /**
   * The name of the product in the order line.
   */
  name: string;
  /**
   * The product ID.
   */
  id: string;
  /**
   * Total amount of the order line, including tax and discount. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  totalAmount: number;
  /**
   * Total amount of order line with discount excluding tax. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  totalAmountExcludingTax: number;
  /**
   * Total tax amount paid for the order line. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  totalTaxAmount: number;
  /**
   * Use TaxRate property instead
   * @deprecated
   */
  taxPercentage?: (number) | null;
  /**
   * Tax percentage for the order line, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate: number;
  /**
   * If no quantity info is provided the order line will default to 1 pcs.
   */
  unitInfo?: (OrderUnitInfo) | null;
  /**
   * Total discount for the order line. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  discount?: (number) | null;
  /**
   * URL linking back to the product at the merchant.
   */
  productUrl?: (string) | null;
  /**
   * Flag for marking the orderline as returned. This will make it count negative towards all the sums in BottomLine.
   */
  isReturn?: (boolean) | null;
  /**
   * Flag for marking the orderline as a shipping line. This will be shown differently in the app.
   */
  isShipping?: (boolean) | null;
};

export type OrderSummary = {
  /**
   * The order lines contain descriptions of each item present in the order.
   */
  orderLines: Array<OrderLine>;
  /**
   * Contains information regarding the order as a whole.
   */
  orderBottomLine: OrderBottomLine;
};

export type OrderUnitInfo = {
  /**
   * Total price per unit, including tax and excluding discount. Must be in minor units. The smallest unit of a currency. Example 100 NOK = 10000.
   */
  unitPrice: number;
  /**
   * Quantity given as a integer or fraction (only for cosmetics).
   */
  quantity: string;
  /**
   * Available units for quantity. Will default to PCS if not set.
   */
  quantityUnit: QuantityUnit;
};

export type OtherLogisticsOption = LogisticsOptionBase & {
  title: string;
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type PaymentMethod = "Wallet" | "Card" | "BankTransfer" | "Klarna";

export type PaymentSources = {
  /**
   * Amount from gift card
   */
  giftCard?: (number) | null;
  /**
   * Amount from card
   */
  card?: (number) | null;
  /**
   * Amount from voucher
   */
  voucher?: (number) | null;
  /**
   * Amount from cash
   */
  cash?: (number) | null;
};

export type PaymentState = "CREATED" | "AUTHORIZED" | "TERMINATED";

export type PaymentTransaction = {
  amount: Amount;
  /**
   * The merchant's unique reference for the transaction. Also known as OrderId. Example: "acme-shop-123-order123abc". See https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   */
  reference: string;
  /**
   * Description visible to the customer during payment. Example: "One pair of socks".
   */
  paymentDescription: string;
  /**
   * Contain descriptions of each item present in the order, and an order bottom line for information regarding the order as a whole.
   */
  orderSummary?: (OrderSummary) | null;
};

export type PeriodSubscriptionCampaign = SubscriptionCampaign & {
  period: Interval;
  type: string;
};

/**
 * The pickup point the customer selected .
 */
export type PickupPoint = {
  /**
   * Pickup point id provided by the carrier. Example: 121648
   */
  id: string;
  /**
   * Pickup point name. Example: Extra Eiganes
   */
  name: string;
  /**
   * Pickup point's street address. Example: VITAMINVEIEN 7
   */
  address: string;
  /**
   * Pickup point's postal code. Example: 0485
   */
  postalCode: string;
  /**
   * Pickup point's city. Example: OSLO
   */
  city: string;
  /**
   * Pickup point's country. Example: NO
   */
  country: string;
  /**
   * Pickup point's opening hours. Example: Man-Søn: 1000-2000
   */
  openingHours?: Array<(string)> | null;
};

/**
 * Configuration required to enable Porterbuddy logistics options
 */
export type Porterbuddy = {
  /**
   * The public key provided to you by Porterbuddy
   */
  publicToken: string;
  /**
   * The API key provided to you by Porterbuddy
   */
  apiKey: string;
  /**
   * Information about the sender
   */
  origin: PorterbuddyOrigin;
};

export type PorterbuddyLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount?: (Amount) | null;
  type?: (PorterbuddyLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type PorterbuddyLogisticsType = "HOME_DELIVERY";

/**
 * Details about the sender of the Porterbuddy parcels
 */
export type PorterbuddyOrigin = {
  /**
   * The name of your store
   */
  name: string;
  /**
   * Your email address where Porterbuddy booking confirmation will be sent
   */
  email: string;
  /**
   * Your phone number where Porterbuddy may send you important messages. Format must be MSISDN (including country code). Example: "4712345678"
   */
  phoneNumber: string;
  /**
   * Your address where Porterbuddy will pick up the parcels
   */
  address: PorterbuddyOriginAddress;
};

export type PorterbuddyOriginAddress = {
  /**
   * Example: "Robert Levins gate 5"
   */
  streetAddress: string;
  /**
   * Example: "0154"
   */
  postalCode: string;
  /**
   * Example: "Oslo"
   */
  city: string;
  /**
   * The ISO-3166-1 Alpha-2 representation of the country. Example: "NO"
   */
  country: string;
};

export type PostenLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (PostenLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type PostenLogisticsType = "MAILBOX" | "PICKUP_POINT" | "HOME_DELIVERY";

export type PostiLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (PostiLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type PostiLogisticsType = "MAILBOX" | "PICKUP_POINT";

export type PostnordLogisticsOption = LogisticsOptionBase & {
  /**
   * Amounts are specified in minor units. For example: 10.00 NOK should be written as 1000; 20.50 EUR should be written as 2050.
   */
  amount: Amount;
  type?: (PostnordLogisticsType) | null;
  customType?: (string) | null;
  /**
   * Tax percentage, represented with 0.01 decimal points. 5000 equals 50% . Between 0-10000
   */
  taxRate?: (number) | null;
  brand: string;
};

export type PostnordLogisticsType = "PICKUP_POINT" | "HOME_DELIVERY";

/**
 * Information about the customer to be prefilled
 *
 * If any of the customer information is invalid such as the phone number,
 * the customer will be prompted to input new user information.
 */
export type PrefillCustomer = {
  /**
   * Example: "Ada"
   */
  firstName?: (string) | null;
  /**
   * Example: "Lovelace"
   */
  lastName?: (string) | null;
  /**
   * Example: "user@example.com"
   */
  email?: (string) | null;
  /**
   * Format must be MSISDN (including country code). Example: "4712345678"
   */
  phoneNumber?: (string) | null;
  /**
   * Example: "Robert Levins gate 5"
   */
  streetAddress?: (string) | null;
  /**
   * Example: "Oslo"
   */
  city?: (string) | null;
  /**
   * Example: "0154"
   */
  postalCode?: (string) | null;
  /**
   * The ISO-3166-1 Alpha-2 representation of the country. Example: "NO"
   */
  country?: (string) | null;
};

export type PriceSubscriptionCampaign = SubscriptionCampaign & {
  end: string;
  type: string;
};

export type QuantityUnit = "PCS" | "KG" | "KM" | "MINUTE" | "LITRE";

/**
 * Defines the details of a bank transfer payment.
 */
export type ResponseBankTransferPaymentDetails = ResponsePaymentDetailsBase & {
  amount: Amount;
  type: string;
};

/**
 * Defines the details of a card payment.
 */
export type ResponseCardPaymentDetails = ResponsePaymentDetailsBase & {
  amount: Amount;
  state: PaymentState;
  aggregate?: (TransactionAggregate) | null;
  type: string;
};

export type ResponsePaymentDetailsBase = {
  [key: string]: unknown;
};

/**
 * Defines the details of the transaction
 */
export type ResponseSubscriptionDetails = {
  /**
   * The state of the recurring agreement.
   */
  state?: (SubscriptionState) | null;
  /**
   * The reference for the agreement. Used to create future charges, as well as updates to the agreement.
   */
  agreementId?: (string) | null;
};

/**
 * Defines the details of a wallet payment.
 */
export type ResponseWalletPaymentDetails = ResponsePaymentDetailsBase & {
  amount: Amount;
  state: PaymentState;
  aggregate?: (TransactionAggregate) | null;
  type: string;
};

/**
 * Session information
 */
export type SessionResponse = {
  /**
   * The Id of the session. Example: "v52EtjZriRmGiKiAKHByK2".
   */
  sessionId: string;
  /**
   * The merchant's serial number. Example: "123456"
   */
  merchantSerialNumber?: (string) | null;
  /**
   * The merchant's unique reference for the transaction. Also known as OrderId. Example: "acme-shop-123-order123abc". See https://developer.vippsmobilepay.com/docs/knowledge-base/orderid/
   */
  reference: string;
  /**
   * The state of the session. Example: "SessionStarted". The state of the payment is in PaymentDetails.State.
   */
  sessionState: ExternalSessionState;
  paymentMethod?: (PaymentMethod) | null;
  subscriptionDetails?: (ResponseSubscriptionDetails) | null;
  paymentDetails?:
    | (
      | ResponseWalletPaymentDetails
      | ResponseCardPaymentDetails
      | ResponseBankTransferPaymentDetails
    )
    | null;
  userInfo?: (UserInfo) | null;
  shippingDetails?: (ShippingDetails) | null;
  billingDetails?: (BillingDetails) | null;
  customConsentProvided?: (boolean) | null;
};

/**
 * Defines the details of the shipping
 */
export type ShippingDetails = {
  /**
   * Example: "Ada"
   */
  firstName?: (string) | null;
  /**
   * Example: "Lovelace"
   */
  lastName?: (string) | null;
  /**
   * Example: "user@example.com"
   */
  email?: (string) | null;
  /**
   * If no country code is provided, defaults to Norway (47). Example: "4712345678"
   */
  phoneNumber?: (string) | null;
  /**
   * Example: "Robert Levins gate 5"
   */
  streetAddress?: (string) | null;
  /**
   * Example: "0154"
   */
  postalCode?: (string) | null;
  /**
   * Example: "Oslo"
   */
  city?: (string) | null;
  /**
   * The ISO-3166-1 Alpha-2 representation of the country. Example: "NO"
   */
  country?: (string) | null;
  /**
   * Id of the shipping method. Example: "123abc"
   */
  shippingMethodId?: (string) | null;
  /**
   * Shipping method amount
   */
  amount?: (Amount) | null;
  pickupPoint?: (PickupPoint) | null;
};

export type Subscription = {
  /**
   * Name of the subscription, visible to the customer during payment. Example: "Bi-Weekly Socks".
   */
  productName: string;
  /**
   * The amount to be charged by the given interval
   */
  amount: Amount;
  /**
   * How often the amount is to be charged. For example every 2 weeks.
   */
  interval: Interval;
  /**
   * Complete URL to the merchant's page regarding the subscription. Example: "https://example.com/vipps/subscription/socks".
   */
  merchantAgreementUrl: string;
  /**
   * Description visible to the customer during subscribing. Example: "Bi-Weekly Subscription of 1 pair of socks".
   */
  productDescription?: (string) | null;
  /**
   * A discount period that ends in a specified date and time.
   */
  campaign?:
    | (
      | EventSubscriptionCampaign
      | PeriodSubscriptionCampaign
      | PriceSubscriptionCampaign
    )
    | null;
};

export type SubscriptionCampaign = {
  price: number;
};

export type SubscriptionState = "PENDING" | "ACTIVE" | "STOPPED" | "EXPIRED";

/**
 * Defines the details of the transaction
 */
export type TransactionAggregate = {
  cancelledAmount?: (Amount) | null;
  capturedAmount?: (Amount) | null;
  refundedAmount?: (Amount) | null;
  authorizedAmount?: (Amount) | null;
};

export type UserFlow = "WEB_REDIRECT" | "NATIVE_REDIRECT";

/**
 * Data from the UserInfo endpoint. Will only be present if UserInfo flow is used.
 */
export type UserInfo = {
  /**
   * The openid sub that uniquely identifies a user.
   */
  sub: string;
  /**
   * Example: "user@example.com"
   */
  email?: (string) | null;
};

export type ParameterVipps_System_Name = string;

export type ParameterVipps_System_Version = string;

export type ParameterVipps_System_Plugin_Name = string;

export type ParameterVipps_System_Plugin_Version = string;

export type Parameterclient_id = string;

export type Parameterclient_secret = string;

export type ParameterOcp_Apim_Subscription_Key = string;

export type ParameterMerchant_Serial_Number = string;

export type ParameterIdempotency_Key = string;

export type PostCheckoutV3SessionData = {
  clientId?: string;
  clientSecret?: string;
  idempotencyKey?: string;
  merchantSerialNumber?: string;
  ocpApimSubscriptionKey?: string;
  requestBody?:
    | InitiatePaymentSessionRequest
    | InitiateSubscriptionSessionRequest;
  vippsSystemName?: string;
  vippsSystemPluginName?: string;
  vippsSystemPluginVersion?: string;
  vippsSystemVersion?: string;
};

export type PostCheckoutV3SessionResponse = InitiateSessionResponse;

export type GetCheckoutV3SessionByReferenceData = {
  clientId?: string;
  clientSecret?: string;
  idempotencyKey?: string;
  merchantSerialNumber?: string;
  ocpApimSubscriptionKey?: string;
  /**
   * The reference of the session. Example: "123123".
   */
  reference: string;
  vippsSystemName?: string;
  vippsSystemPluginName?: string;
  vippsSystemPluginVersion?: string;
  vippsSystemVersion?: string;
};

export type GetCheckoutV3SessionByReferenceResponse = SessionResponse;

export type $OpenApiTs = {
  "/checkout/v3/session": {
    post: {
      req: PostCheckoutV3SessionData;
      res: {
        /**
         * Success
         */
        200: InitiateSessionResponse;
        /**
         * BadRequest: Validation errors
         */
        400: CheckoutProblemDetails;
        /**
         * Unauthorized: Invalid credentials
         */
        401: CheckoutProblemDetails;
        /**
         * Forbidden: Invalid subscription or configuration
         */
        403: CheckoutProblemDetails;
        /**
         * Conflict. Duplicate reference
         */
        409: CheckoutProblemDetails;
        /**
         * InternalServerError: Unexpected errors
         */
        500: CheckoutProblemDetails;
        /**
         * BadGateway: Unexpected errors in integrations
         */
        502: CheckoutProblemDetails;
      };
    };
  };
  "/checkout/v3/session/{reference}": {
    get: {
      req: GetCheckoutV3SessionByReferenceData;
      res: {
        /**
         * Success
         */
        200: SessionResponse;
        /**
         * BadRequest: Validation errors
         */
        400: CheckoutProblemDetails;
        /**
         * Unauthorized: Invalid credentials
         */
        401: CheckoutProblemDetails;
        /**
         * Forbidden: Invalid subscription or configuration
         */
        403: CheckoutProblemDetails;
        /**
         * NotFound: The specified session id is unknown.
         */
        404: CheckoutProblemDetails;
        /**
         * InternalServerError: Unexpected errors
         */
        500: CheckoutProblemDetails;
        /**
         * BadGateway: Unexpected errors in integrations
         */
        502: CheckoutProblemDetails;
      };
    };
  };
};
///////////// COMMON ////////////////
export type OrderManagementErrorResponse = {
  type?: string;
  title: string;
  detail: string;
  instance: string;
  invalidParams?: {
    name: string;
    reason: string;
  }[];
};

/**
 * Image Id
 *
 * @pattern ^[0-9A-Za-z-_\.]+$
 * @minLength 1
 * @maxLength 128
 * @example vipps-socks-orange-123
 */
export type OrderManagementImageId = string;

/**
 * The type of transaction {ecom, recurring}. Use "ecom" for both eCom API
 * and ePayment API payments. Use "recurring" for Recurring API payments.
 */
export type OrderManagementPaymentType = "ecom" | "recurring";

/**
 * The orderId of the transaction, unique and managed by merchant
 * @pattern ^[0-9A-Za-z-_\.]+$
 */
export type OrderManagementOrderId = string;

export type OrderManagementCategory =
  | "GENERAL"
  | "RECEIPT"
  | "ORDER_CONFIRMATION"
  | "DELIVERY"
  | "TICKET"
  | "BOOKING";

///////////// ADD CATEGORY ////////////////

export type OrderManagementAddCategoryRequest = OrderManagementOrder;

export type OrderManagementOrder = {
  /**
   * The category of the order. This will determine the icon and color of the order in the app.
   * @example "GENERAL"
   */
  category: OrderManagementCategory;
  /**
   * URL linking back to the merchant's website/store.
   * @minLength 1
   * @format uri
   * @example: https://www.example.com
   */
  orderDetailsUrl: string;
  /**
   * The ID of the image that is used to represent the on the merchants page
   */
  imageId?: OrderManagementImageId | null;
};

/**
 * @example 16328cb8-d769-4c53-90ad-e19777823f0a
 */
export type OrderManagementOKResponse = string;

///////////// ADD IMAGE ////////////////

export type OrderManagementImage = {
  /**
   * Id of the image to be added
   */
  imageId: OrderManagementImageId;
  /**
   * The image data as a base64 encoded string (not a URL). The image
   * must be in PNG or JPEG format. Square images are recommended.
   * Minimum height is 167px, and max file size is 2MB.
   * @example iVBORw0KGgoAAAANSUhEUgAAAKsAAADVCAMAAAAfHv
   */
  src: string;
  type: "base64";
};

export type OrderManagementAddImageOKResponse = {
  imageId: OrderManagementImageId;
};

///////////// ADD RECEIPT ////////////////

export type OrderManagementReceipt = {
  /**
   * Amounts are specified in minor units (i.e., integers with two trailing
   * zeros). For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @minItems 1
   */
  orderLines: OrderManagementOrderLine[];
  /**
   * Summary of the order. Total amount and total. Amounts are specified in
   * minor units (i.e., integers with two trailing zeros). For example: 10.00
   * EUR/NOK/DKK should be written as 1000.
   */
  bottomLine: OrderManagementBottomLine;
};

export type OrderManagementOrderLine = {
  /**
   * Name of the product in the order line.
   *
   * @example "socks"
   */
  name: string;
  /**
   * The product ID
   *
   * @example "1234567890"
   */
  id: string;
  /**
   * Total amount of the order line, including tax and discount.
   * Amounts are specified in minor units (i.e., integers with two trailing zeros).
   * For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @format int64
   * @example 1000
   */
  totalAmount: number;
  /**
   * Total amount of order line with discount excluding tax.
   * Amounts are specified in minor units (i.e., integers with two trailing zeros).
   * For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @format int64
   * @example 800
   */
  totalAmountExcludingTax: number;
  /**
   * Total tax amount paid for the order line.
   * Amounts are specified in minor units (i.e., integers with two trailing zeros).
   * For example: 10.00 EUR/NOK/DKK should be written as 1000.
   *
   * @format int64
   * @example 250
   */
  totalTaxAmount: number;
  /**
   * Tax percentage for the order line. Between 0-100
   *
   * @minimum 0
   * @maximum 100
   * @example 25
   */
  taxPercentage: number;
  /**
   * If no quantity info is provided the order line will default to 1 pcs
   */
  unitInfo?: OrderManagementUnitInfo | null;
  /**
   * Total discount for the order line.
   * Amounts are specified in minor units (i.e., integers with two trailing zeros).
   * For example: 1.00 EUR/NOK/DKK should be written as 100.
   *
   * @format int64
   * @minimum 0
   * @example 2000
   */
  discount?: number | null;
  /**
   * Optional URL linking back to the product at the merchant.
   *
   * @example "https://example.com/store/socks"
   */
  productUrl?: string | null;
  /**
   * Flag for marking the order line as returned. This will make it count
   * negative towards all the sums in bottomLine.
   *
   * @example false
   */
  isReturn?: boolean | null;
  /**
   * Flag for marking the order line as a shipping line. This will be shown differently in the app.
   * @example false
   */
  isShipping?: boolean | null;
};

export type OrderManagementUnitInfo = {
  /**
   * Total price per unit, including tax and excluding discount
   *
   * @format int64
   * @minimum 0
   */
  unitPrice: number | null;
  /**
   * Quantity given as a integer or fraction (only for cosmetics)
   *
   * @maxLength 10
   * @pattern ^\d+([\.]\d{1,8})?$
   * @example "0.822"
   */
  quantity: string;
  /** Available units for quantity. Will default to PCS if not set */
  quantityUnit?: OrderManagementQuantityUnit;
};

/**
 * Available units for quantity. Will default to PCS if not set
 * @default "PCS"
 */
export type OrderManagementQuantityUnit =
  | "PCS"
  | "KG"
  | "KM"
  | "MINUTE"
  | "LITRE"
  | "KWH";

export type OrderManagementBottomLine = {
  /**
   * The currency identifier according to ISO 4217.
   * "NOK", "DKK" or "EUR.
   * @minLength 3
   * @maxLength 3
   */
  currency: OrderManagementCurrency;
  /**
   * Tip amount for the order. Amounts are specified in minor units
   * (i.e., integers with two trailing zeros). For example: 10.00
   * EUR/NOK/DKK should be written as 1000.
   *
   * @format int64
   * @minimum 0
   * @example 2000
   */
  tipAmount?: number | null;
  /**
   * POS ID is the device number of the POS terminal
   * Not to be confused with any Vipps MobilePay ID.
   */
  posId?: string | null;
  paymentSources?: OrderManagementPaymentSources;
  barcode?: OrderManagementBarcode;
  receiptNumber?: string | null;
};

export type OrderManagementCurrency = "NOK" | "DKK" | "EUR";

export type OrderManagementPaymentSources = {
  giftCard?: number | null;
  card?: number | null;
  voucher?: number | null;
  cash?: number | null;
};

export type OrderManagementBarcode = {
  format: OrderManagementBarcodeFormat;
  data: string | null;
};

export type OrderManagementBarcodeFormat = "EAN-13" | "CODE 39" | "CODE 128";

///////////// GET ORDER ////////////////

export type OrderManagementGetOrderOKResponse = {
  category: OrderManagementOrder;
  receipt: OrderManagementReceipt;
};

import { Currency } from "./common_types.ts";

type EPAYMENT = "ecom";
type ECOM = "ecom";
type RECURRING = "recurring";

export type OrderManagementPaymentType =
  | EPAYMENT
  | ECOM
  | RECURRING;

type OrderManagementCategory =
  | "GENERAL"
  | "RECEIPT"
  | "ORDER_CONFIRMATION"
  | "DELIVERY"
  | "TICKET"
  | "BOOKING";

export type TypedOrderManagementAddCategoryToOrderRequest = {
  /**
   * The category of the order. <br />
   * GENERAL | RECEIPT | ORDER_CONFIRMATION | DELIVERY | TICKET | BOOKING
   */
  category: OrderManagementCategory; // GENERAL | RECEIPT | ORDER_CONFIRMATION | DELIVERY | TICKET | BOOKING
  /**
   * The URL to the order details page on the merchant's website
   */
  orderDetailsUrl: string; // URL
  /**
   * The ID of the image that is used to represent the on the merchants page
   */
  imageId: string | null; //
};

export type OrderManagementAddCategoryOKResponse = {
  string: string;
};

type InvalidParam = {
  name: string;
  reason: string;
};

export type OrderManagementErrorResponse = {
  type?: string;
  title: string;
  detail: string;
  instance: string;
  invalidParams?: InvalidParam[];
};

// /v1/images
export type OrderManagementAddImageRequest = {
  imageId: string;
  /**
   * The image data as a base64 encoded string, not to be confused with a URL.
   * The image _must_ be in PNG or JPEG format. Square images are recommended, min height is 167px and max file size is 2MB.
   */
  src: string;
  /**
   * Value: base64
   */
  type: string;
};

export type OrderManagementAddImageOKResponse = {
  imageId: string;
};

type OrderManagementQuantityUnit =
  | "PCS"
  | "KG"
  | "KM"
  | "MINUTE"
  | "LITRE"
  | "KWH";

type OrderManagementUnitInfo = {
  /**
   * The price per unit of the product in the order line. Must be in Minor Units. The smallest unit of a currency. Example 1,- NOK = 100.
   * @format int64
   */
  unitPrice: number | null;
  /**
   * The quantity of the product in the order line.
   * @maxLength 10
   */
  quantity: string;
  /**
   * Enum: "PCS" "KG" "KM" "MINUTE" "LITRE" "KWH"
   * Available units for quantity. Will default to PCS if not set
   * @default "PCS"
   */
  quantityUnit?: OrderManagementQuantityUnit;
};

type OrderLine = {
  /**
   * The name of the product in the order line.
   * @minLength 1
   * @maxLength 2048
   */
  name: string;
  /**
   * The product ID.
   * TODO Verify that the maxLength is 255 characters
   * @minLength 1
   * @maxLength 255
   */
  id: string;
  /**
   * Total amount of the order line, including tax and discount. Must be in Minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  totalAmount: number;
  /**
   * Total amount of order line with discount excluding tax. Must be in Minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * @format int64
   * @min 0
   */
  totalAmountExcludingTax: number;
  /**
   * Total tax amount paid for the order line. Must be in Minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
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
  unitInfo?: OrderManagementUnitInfo | null;
  /**
   * Total discount for the order line. Must be in Minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
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

type OMShippingInfo = {
  amount: number | null;
  amountExcludingTax: number | null;
  taxAmount: number | null;
  taxPercentage: number | null;
};

type OMPaymentSources = {
  giftCard?: number | null;
  card?: number | null;
  voucher?: number | null;
  cash?: number | null;
};
export type BarcodeFormats = "EAN-13" | "CODE 39" | "CODE 128";
type OMBarCode = {
  format: string;
  data: BarcodeFormats | null;
};

type BottomLine = {
  /**
   * The currency identifier according to ISO 4217.
   * "NOK", "DKK" or "EUR.
   * @minLength 3
   * @maxLength 3
   */
  currency: Currency;
  /**
   * Tip amount for the order. Must be in Minor Units. The smallest unit of a currency. Example 100 NOK = 10000.
   * TODO Add validation that number is a positive integer
   * @format int64
   */
  tipAmount?: number | null;
  /**
   * POS ID is the device number of the POS terminal.
   * Not to be confused with any Vipps MobilePay ID.
   */
  posId?: string | null;

  shippingInfo?: OMShippingInfo;
  paymentSources?: OMPaymentSources;
  barcode?: OMBarCode;
  receiptNumber?: string | null;
};

// GET Order w/category and receipt
export type OrderManagementGetOrderOKResponse = {
  category: OrderManagementCategory;
  orderDetailsUrl: string;
  imageId?: string | null;

  orderLines: OrderLine[];
  bottomLine: BottomLine;
};

//
// POST ADD RECEIPT
//
export type OrderManagementAddReceiptOKResponse = {
  // AddReceipt returns text/plain string
  body: string;
};

export type OrderManagementAddReceiptRequest = {
  orderLines: OrderLine[];
  bottomLine: BottomLine;
};

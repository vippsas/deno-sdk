/**
 * @description Requested image format.
 * Supported values: {image/*,image/png, image/svg+xml, text/targetUrl}
 * @example "image/png"
 */
export type RedirectQrImageFormat =
  | "image/*"
  | "image/png"
  | "image/svg+xml"
  | "text/targetUrl";

export type RedirectQrRequest = {
  /**
   * Merchant supplied Id for QR
   * @minLength 1
   * @maxLength 128
   * @pattern ^[-_+%æøåÆØÅ\w\s]*$
   * @example "billboard_1"
   */
  id: string | null;
  /**
   * The target url of the QR (redirect destination)
   * @format uri
   * @pattern ^https:\/\/[\w\.]+([\w#!:.?+=&%@\-\/]+)?$
   * @example "https://example.com/myProduct"
   */
  redirectUrl: string | null;
  /**
   * Optional time-to-live field, given in seconds
   * @min 300
   * @max 2147483647
   * @example 600
   */
  ttl?: number | null;
};

export type RedirectQrResponse = {
  /**
   * Merchant supplied Id for QR
   * @pattern ^[-_+%æøåÆØÅ\w\s]*$
   * @example "billboard_1"
   */
  id: string;
  /**
   * Link to QR image
   * @format uri
   * @example "https://qr.vipps.no/generate/qr.png?..."
   */
  url: string;
  /**
   * The target url of the QR (redirect destination)
   * @format uri
   * @pattern ^https:\/\/[\w\.]+([\w#!:.?+=&%@\-\/]+)?$
   * @example "https://example.com/myProduct"
   */
  redirectUrl: string;
  /**
   * Time in seconds until expiration. -1 means no expiration (infinite QR code)
   * @example 598
   */
  expiresIn?: number;
};

export type RedirectQrUpdateRequest = {
  /**
   * @format uri
   * @pattern ^https:\/\/[\w\.]+([\w#!:.?+=&%@\-\/]+)?$
   * @example "https://example.com/myProduct"
   */
  redirectUrl: string;
};

/**
 * @description Requested image format. Supported values: {PNG, SVG}.
 * If not provided, SVG is chosen.
 * @example "PNG"
 * @default "SVG"
 */
export type CallbackQrImageFormat = "PNG" | "SVG";

/**
 * @description Dimensions for the image. Only relevant if PNG is chosen as image format.
 * @minimum 100
 * @maximum 2000
 * @example 200. Then 200x200 px is set at dimension for the QR.
 */
export type CallbackQrImageSize = number;

export type CallbackQrRequest = {
  /** A description of where the QR code will be located. It will be shown in the app when a user scans the QR code. Examples could be ‘Kasse 1’ , ‘Kiosk’ or ‘Platform 3’. */
  locationDescription: string;
};

export type CallbackQrResponse = {
  /** The merchant serial number (MSN) for the sale unit */
  merchantSerialNumber?: string;
  /** The merchant defined identifier for a QR code. It will be provided in the callback to the merchant when the QR code has been scanned. */
  merchantQrId?: string;
  /** A description of where the QR code will be located. It will be shown in the app when a user scans the QR code. Examples could be ‘Kasse 1’ , ‘Kiosk’ or ‘Platform 3’. */
  locationDescription?: string;
  /**
   * The link to the actual QR code.
   * @format uri
   * @example "https://qr.vipps.no/generate/qr.png?..."
   */
  qrImageUrl?: string;
  /** The text that is being encoded by the QR code. This is the actual content of the QR code. */
  qrContent?: string;
};

export type QrErrorResponse = {
  /** @minLength 1 */
  type?: string;
  /** @minLength 1 */
  title: string;
  /** @minLength 1 */
  detail: string;
  /** @minLength 1 */
  instance: string;
  invalidParams?: {
    /** @minLength 1 */
    name: string;
    /** @minLength 1 */
    reason: string;
  }[];
};

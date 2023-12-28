import { RequestData } from "../types.ts";
import {
  MerchantCallbackQr,
  MerchantCallbackRequest,
  QrErrorResponse,
  QrImageFormat,
  QrImageSize,
} from "./types/qr_types.ts";

/**
 * Factory for creating Merchant callback QR request.
 */
export const callbackQRRequestFactory = {
  /**
   * Creates a callback QR request.
   *
   * @param token - The authentication token.
   * @param merchantQrId - The merchant defined identifier for a QR code.
   * @param body - The request body.
   * @returns A `RequestData` object representing the callback QR request.
   */
  create(
    token: string,
    merchantQrId: string,
    body: MerchantCallbackRequest,
  ): RequestData<void, QrErrorResponse> {
    return {
      url: `/qr/v1/merchant-callback/${merchantQrId}`,
      method: "PUT",
      body,
      token,
    };
  },
  /**
   * Returns the QR code represented by the merchantQrId and
   * Merchant-Serial-Number provided in the path and header respectively.
   * The image format and size of the QR code is defined by the Accept
   * and Size headers respectively.
   *
   * @param token - The authentication token.
   * @param merchantQrId - The ID of the merchant callback QR code.
   * @param qrImageFormat - The format of the QR code image (default: "SVG").
   * @param qrImageSize - The size of the QR code image (optional).
   * @returns A `RequestData` object containing the URL, method, and token.
   */
  info(
    token: string,
    merchantQrId: string,
    qrImageFormat: QrImageFormat = "SVG",
    qrImageSize?: QrImageSize,
  ): RequestData<MerchantCallbackQr, QrErrorResponse> {
    const url = qrImageSize
      ? `/qr/v1/merchant-callback/${merchantQrId}?QrImageFormat=${qrImageFormat}&QrImageSize=${qrImageSize}`
      : `/qr/v1/merchant-callback/${merchantQrId}?QrImageFormat=${qrImageFormat}`;

    return { url, method: "GET", token };
  },
  /**
   * Returns all QR codes that matches the provided Merchant-Serial-Number.
   *
   * @param token - The authentication token.
   * @param qrImageFormat - The format of the QR image. Defaults to "SVG".
   * @param qrImageSize - The size of the QR image.
   * @returns A `RequestData` object containing the URL, method, and token.
   */
  list(
    token: string,
    qrImageFormat: QrImageFormat = "SVG",
    qrImageSize?: QrImageSize,
  ): RequestData<MerchantCallbackQr[], QrErrorResponse> {
    const url = qrImageSize
      ? `/qr/v1/merchant-callback?QrImageFormat=${qrImageFormat}&QrImageSize=${qrImageSize}`
      : `/qr/v1/merchant-callback?QrImageFormat=${qrImageFormat}`;

    return { url, method: "GET", token };
  },
  /**
   * Deletes the QR code that matches the provided merchantQrId and merchantSerialNumber.
   * 
   * @param token - The authentication token.
   * @param merchantQrId - The ID of the merchant QR to delete.
   * @returns A `RequestData` object with the URL, method, and token for the delete request.
   */
  delete(
    token: string,
    merchantQrId: string,
  ): RequestData<void, QrErrorResponse> {
    return {
      url: `/qr/v1/merchant-callback/${merchantQrId}`,
      method: "DELETE",
      token,
    };
  },
  /**
   * NOTE: This endpoint is only intended for MobilePay PoS customers. 
   * It will be removed as soon as migration is completed.
   * 
   * This endpoint is for migrating existing MobilePay PoS QR codes from the 
   * current solution that will end its lifetime. It is meant for merchants 
   * that have printed QR codes and want them to stay functional for the new 
   * product offering that will replace the now deprecated solution.
   * 
   * This endpoint will not create a new QR code but rather map the provided 
   * beaconId with the Merchant-Serial-Number, to make sure the already 
   * printed QR code can be re-used. When the QR code is scanned by MobilePay 
   * users, it will result in a callback being sent to the merchant if the 
   * merchant has registered a webhook for the user.checked-in.v1 event.
   * 
   * The callback will include a MerchantQrId which in this scenario will 
   * equal the beaconId.
   * 
   * @param token - The authentication token.
   * @param beaconId - The beacon ID.
   * @param body - The request body.
   * @returns The request data.
   */
  createMobilePayQR(
    token: string,
    beaconId: string,
    body: MerchantCallbackRequest,
  ): RequestData<void, QrErrorResponse> {
    return {
      url: `/qr/v1/merchant-callback/mobilepay/${beaconId}`,
      method: "PUT",
      body,
      token,
    };
  },
};

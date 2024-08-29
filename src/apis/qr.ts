import type { RequestData } from "../types.ts";
import type {
  CallbackQrImageFormat,
  CallbackQrImageSize,
  CallbackQrRequest,
  CallbackQrResponse,
  QrErrorResponse,
  RedirectQrImageFormat,
  RedirectQrRequest,
  RedirectQrResponse,
  RedirectQrUpdateRequest,
} from "./types/qr_types.ts";

/**
 * Factory function for creating a redirect QR request.
 */
export const redirectQRRequestFactory = {
  /**
   * Generate a QR that works as a redirect back to the merchant
   *
   * @param token - The authentication token.
   * @param imageFormat - The format of the QR code image to be returned.
   * @param body - The request body containing the merchant redirect
   * QR code details.
   * @returns A `RedirectQrResponse` or `QrErrorResponse` object.
   * If response has statuscode 409, the response will be `{ id: string }`
   */
  create: (
    token: string,
    imageFormat: RedirectQrImageFormat,
    body: RedirectQrRequest,
  ): RequestData<RedirectQrResponse, QrErrorResponse | { id: string }> => {
    return {
      url: `/qr/v1/merchant-redirect`,
      method: "POST",
      additionalHeaders: { "Accept": imageFormat },
      body,
      token,
    };
  },
  /**
   * Update the redirect url (target destination) of the QR.
   *
   * @param token - The authentication token.
   * @param id - The ID of the QR code to update.
   * @param imageFormat - The format of the QR code image to be returned.
   * @param body - The request body containing the updated QR code data.
   * @returns A `RedirectQrResponse` or `QrErrorResponse` object.
   */
  update: (
    token: string,
    id: string,
    imageFormat: RedirectQrImageFormat,
    body: RedirectQrUpdateRequest,
  ): RequestData<RedirectQrResponse, QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-redirect/${id}`,
      method: "PUT",
      additionalHeaders: { "Accept": imageFormat },
      body,
      token,
    };
  },
  /**
   * Retrieves information about a merchant redirect QR code by its ID.
   *
   * @param token - The authentication token.
   * @param id - The ID of the QR code.
   * @param imageFormat - The format of the QR code image to be returned.
   * @returns A `RedirectQrResponse` or `QrErrorResponse` object.
   */
  info: (
    token: string,
    id: string,
    imageFormat: RedirectQrImageFormat,
  ): RequestData<RedirectQrResponse, QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-redirect/${id}`,
      method: "GET",
      additionalHeaders: { "Accept": imageFormat },
      token,
    };
  },
  /**
   * Get all merchant redirect QRs for this saleunit
   *
   * @param token - The authentication token.
   * @param imageFormat - The format of the QR code image.
   * @returns A `RedirectQrResponse` or `QrErrorResponse` object.
   */
  list: (
    token: string,
    imageFormat: RedirectQrImageFormat,
  ): RequestData<RedirectQrResponse[], QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-redirect`,
      method: "GET",
      additionalHeaders: { "Accept": imageFormat },
      token,
    };
  },
  /**
   * Deletes a merchant redirect QR code by its ID.
   *
   * @param token - The authentication token.
   * @param id - The ID of the QR code to delete.
   * @returns void or a `QrErrorResponse` object.
   */
  delete: (
    token: string,
    id: string,
  ): RequestData<void, QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-redirect/${id}`,
      method: "DELETE",
      token,
    };
  },
};

/**
 * Factory for creating Merchant callback QR request.
 */
export const callbackQRRequestFactory = {
  /**
   * Create or update callback QR.
   *
   * **NOTE: MobilePay integrators that needs to migrate existing QRs cannot
   * use this endpoint. They must use the dedicated endpoint:
   * PUT /qr/v1/merchant-callback/mobilepay/{beaconId} **
   *
   * Creates or updates the QR code that encapsulates the provided
   * `merchantSerialNumber` and `merchantQrId`.
   * See [Webhooks API](/docs/APIs/webhooks-api) to create a webhook
   * that will send callbacks when this QR code is scanned by a Vipps or
   * MobilePay user. If the endpoint is called with the same `merchantQrId`
   * twice or more, it is the last call that defines the location property.
   * The actual QR code image will not be updated on consecutive calls.
   *
   * @param token - The authentication token.
   * @param merchantQrId - The merchant defined identifier for a QR code.
   * @param body - The request body containing the callback QR details.
   * @returns  A void or a `QrErrorResponse` object.
   */
  create: (
    token: string,
    merchantQrId: string,
    body: CallbackQrRequest,
  ): RequestData<void, QrErrorResponse> => {
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
   * @returns A `CallbackQrResponse` or `QrErrorResponse` object.
   */
  info: (
    token: string,
    merchantQrId: string,
    qrImageFormat: CallbackQrImageFormat = "SVG",
    qrImageSize?: CallbackQrImageSize,
  ): RequestData<CallbackQrResponse, QrErrorResponse> => {
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
   * @param qrImageSize - The size of the QR image (optional).
   * @returns A `CallbackQrResponse` or `QrErrorResponse` object.
   */
  list: (
    token: string,
    qrImageFormat: CallbackQrImageFormat = "SVG",
    qrImageSize?: CallbackQrImageSize,
  ): RequestData<CallbackQrResponse[], QrErrorResponse> => {
    const url = qrImageSize
      ? `/qr/v1/merchant-callback?QrImageFormat=${qrImageFormat}&QrImageSize=${qrImageSize}`
      : `/qr/v1/merchant-callback?QrImageFormat=${qrImageFormat}`;

    return { url, method: "GET", token };
  },
  /**
   * Deletes the QR code that matches the provided merchantQrId and
   * merchantSerialNumber.
   *
   * @param token - The authentication token.
   * @param merchantQrId - The ID of the merchant QR to delete.
   * @returns A void or a `QrErrorResponse` object.
   */
  delete: (
    token: string,
    merchantQrId: string,
  ): RequestData<void, QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-callback/${merchantQrId}`,
      method: "DELETE",
      token,
    };
  },
  /**
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
   * @param body - The request body containing the callback QR details.
   * @returns void or a `QrErrorResponse` object.
   */
  createMobilePayQR: (
    token: string,
    beaconId: string,
    body: CallbackQrRequest,
  ): RequestData<void, QrErrorResponse> => {
    return {
      url: `/qr/v1/merchant-callback/mobilepay/${beaconId}`,
      method: "PUT",
      body,
      token,
    };
  },
};

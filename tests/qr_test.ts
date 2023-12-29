import { callbackQRRequestFactory } from "../src/apis/qr.ts";
import { MerchantCallbackRequest } from "../src/apis/types/qr_types.ts";
import { assert } from "./test_deps.ts";

Deno.test("qr - create - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";
  const body: MerchantCallbackRequest = {
    locationDescription: "your-location-description",
  };

  const requestData = callbackQRRequestFactory.create(
    token,
    merchantQrId,
    body,
  );

  assert(requestData.url, "/qr/v1/merchant-callback/your-merchant-qr-id");
  assert(requestData.method, "PUT");
  assert(requestData.token, token);
});

Deno.test("qr - info - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";
  const qrImageFormat = "PNG";
  const qrImageSize = 200;

  const requestData = callbackQRRequestFactory.info(
    token,
    merchantQrId,
    qrImageFormat,
    qrImageSize,
  );

  assert(
    requestData.url,
    "/qr/v1/merchant-callback/your-merchant-qr-id?QrImageFormat=SVG&QrImageSize=200",
  );
  assert(requestData.method, "GET");
  assert(requestData.token, token);
});

Deno.test("qr - list - should return a valid request data object", () => {
  const token = "your-auth-token";
  const qrImageFormat = "SVG";
  const qrImageSize = 200;

  const requestData = callbackQRRequestFactory.list(
    token,
    qrImageFormat,
    qrImageSize,
  );

  assert(
    requestData.url,
    "/qr/v1/merchant-callback?QrImageFormat=SVG&QrImageSize=200",
  );
  assert(requestData.method, "GET");
  assert(requestData.token, token);
});

Deno.test("qr - delete - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";

  const requestData = callbackQRRequestFactory.delete(token, merchantQrId);

  assert(requestData.url, "/qr/v1/merchant-callback/your-merchant-qr-id");
  assert(requestData.method, "DELETE");
  assert(requestData.token, token);
});

Deno.test("qr - createMobilePayQR - should return a valid request data object", () => {
  const token = "your-auth-token";
  const beaconId = "your-beacon-id";
  const body: MerchantCallbackRequest = {
    locationDescription: "your-location-description",
  };

  const requestData = callbackQRRequestFactory.createMobilePayQR(
    token,
    beaconId,
    body,
  );

  assert(requestData.url, "/qr/v1/merchant-callback/mobilepay/your-beacon-id");
  assert(requestData.method, "PUT");
  assert(requestData.token, token);
});

import {
  callbackQRRequestFactory,
  redirectQRRequestFactory,
} from "../src/apis/qr.ts";
import {
  CallbackQrRequest,
  RedirectQrRequest,
} from "../src/apis/types/qr_types.ts";
import { assert } from "./test_deps.ts";

Deno.test("redirectQR - create - should return a RequestData object with the correct properties", () => {
  const token = "my-auth-token";
  const imageFormat = "image/png";
  const body: RedirectQrRequest = {
    id: "12345",
    redirectUrl: "https://example.com",
    ttl: 600,
  };

  const requestData = redirectQRRequestFactory.create(token, imageFormat, body);

  assert(requestData.url, "/qr/v1/merchant-redirect");
  assert(requestData.method, "POST");
  assert(requestData.token, token);
});

Deno.test("redirectQR - info - should return a RequestData object with the correct properties", () => {
  const token = "my-auth-token";
  const id = "12345";
  const imageFormat = "image/png";

  const requestData = redirectQRRequestFactory.info(token, id, imageFormat);

  assert(requestData.url, `/qr/v1/merchant-redirect/${id}`);
  assert(requestData.method, "GET");
  assert(requestData.token, token);
});

Deno.test("callbackQR - create - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";
  const body: CallbackQrRequest = {
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

Deno.test("callbackQR - info - should return a valid request data object", () => {
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

Deno.test("callbackQR - list - should return a valid request data object", () => {
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

Deno.test("callbackQR - delete - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";

  const requestData = callbackQRRequestFactory.delete(token, merchantQrId);

  assert(requestData.url, "/qr/v1/merchant-callback/your-merchant-qr-id");
  assert(requestData.method, "DELETE");
  assert(requestData.token, token);
});

Deno.test("callbackQR - createMobilePayQR - should return a valid request data object", () => {
  const token = "your-auth-token";
  const beaconId = "your-beacon-id";
  const body: CallbackQrRequest = {
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

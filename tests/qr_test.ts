import { callbackQRRequestFactory, redirectQRRequestFactory } from "../src/apis/qr.ts";
import { CallbackQrImageFormat, CallbackQrImageSize, CallbackQrRequest, RedirectQrImageFormat, RedirectQrRequest } from "../src/apis/types/qr_types.ts";
import { assert } from "./test_deps.ts";

Deno.test("redirectQRRequestFactory.create", () => {
  const token = "my-auth-token";
  const imageFormat: RedirectQrImageFormat = "PNG";
  const body: RedirectQrRequest = {
    // Provide the necessary properties for the request body
  };

  const requestData = redirectQRRequestFactory.create(token, imageFormat, body);

  assert(requestData.url, "/qr/v1/merchant-redirect");
  assert(requestData.method, "POST");
  assert(requestData.headers, { "Accept": imageFormat });
  assert(requestData.body, body);
  assert(requestData.token, token);
});

Deno.test("redirectQRRequestFactory.info", () => {
  const token = "my-auth-token";
  const id = "my-qr-id";
  const imageFormat: RedirectQrImageFormat = "PNG";

  const requestData = redirectQRRequestFactory.info(token, id, imageFormat);

  assert(requestData.url, `/qr/v1/merchant-redirect/${id}`);
  assert(requestData.method, "GET");
  assert(requestData.headers, { "Accept": imageFormat });
  assert(requestData.token, token);
});

Deno.test("callbackQRRequestFactory.create", () => {
  const token = "my-auth-token";
  const merchantQrId = "my-merchant-qr-id";
  const body: CallbackQrRequest = {
    // Provide the necessary properties for the request body
  };

  const requestData = callbackQRRequestFactory.create(token, merchantQrId, body);

  assert(
    requestData.url,
    `/qr/v1/merchant-callback/${merchantQrId}`,
  );
  assert(requestData.method, "PUT");
  assert(requestData.body, body);
  assert(requestData.token, token);
});

Deno.test("callbackQRRequestFactory.info", () => {
  const token = "my-auth-token";
  const merchantQrId = "my-merchant-qr-id";
  const qrImageFormat: CallbackQrImageFormat = "SVG";
  const qrImageSize: CallbackQrImageSize = "200x200";

  const requestData = callbackQRRequestFactory.info(
    token,
    merchantQrId,
    qrImageFormat,
    qrImageSize,
  );

  assert(
    requestData.url,
    `/qr/v1/merchant-callback/${merchantQrId}?QrImageFormat=${qrImageFormat}&QrImageSize=${qrImageSize}`,
  );
  assert(requestData.method, "GET");
  assert(requestData.token, token);
});

Deno.test("callbackQRRequestFactory.list", () => {
  const token = "my-auth-token";
  const qrImageFormat: CallbackQrImageFormat = "SVG";
  const qrImageSize: CallbackQrImageSize = "200x200";

  const requestData = callbackQRRequestFactory.list(
    token,
    qrImageFormat,
    qrImageSize,
  );

  assert(
    requestData.url,
    `/qr/v1/merchant-callback?QrImageFormat=${qrImageFormat}&QrImageSize=${qrImageSize}`,
  );
  assert(requestData.method, "GET");
  assert(requestData.token, token);
});

Deno.test("callbackQRRequestFactory.delete", () => {
  const token = "my-auth-token";
  const merchantQrId = "my-merchant-qr-id";

  const requestData = callbackQRRequestFactory.delete(token, merchantQrId);

  assert(
    requestData.url,
    `/qr/v1/merchant-callback/${merchantQrId}`,
  );
  assert(requestData.method, "DELETE");
  assert(requestData.token, token);
});

Deno.test("callbackQRRequestFactory.createMobilePayQR", () => {
  const token = "my-auth-token";
  const beaconId = "my-beacon-id";
  const body: CallbackQrRequest = {
    // Provide the necessary properties for the request body
  };

  const requestData = callbackQRRequestFactory.createMobilePayQR(
    token,
    beaconId,
    body,
  );

  assert(
    requestData.url,
    `/qr/v1/merchant-callback/mobilepay/${beaconId}`,
  );
  assert(requestData.method, "PUT");
  assert(requestData.body, body);
  assert(requestData.token, token);
});

Deno.test("qr - create - should return a valid request data object", () => {
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

import {
  callbackQRRequestFactory,
  redirectQRRequestFactory,
} from "../src/apis/qr.ts";
import type {
  CallbackQrRequest,
  RedirectQrRequest,
  RedirectQrUpdateRequest,
} from "../src/apis/types/qr_types.ts";
import { assertEquals } from "@std/assert";

Deno.test("redirectQR - create - should return a RequestData object with the correct properties", () => {
  const token = "my-auth-token";
  const imageFormat = "image/png";
  const body: RedirectQrRequest = {
    id: "12345",
    redirectUrl: "https://example.com",
    ttl: 600,
  };

  const requestData = redirectQRRequestFactory.create(token, imageFormat, body);

  assertEquals(requestData.url, "/qr/v1/merchant-redirect");
  assertEquals(requestData.method, "POST");
});

Deno.test("redirectQR - update - should return a RequestData object with the correct properties", () => {
  const token = "my-auth-token";
  const id = "12345";
  const imageFormat = "image/png";
  const body: RedirectQrUpdateRequest = {
    redirectUrl: "https://foobar.com",
  };

  const requestData = redirectQRRequestFactory.update(
    token,
    id,
    imageFormat,
    body,
  );

  assertEquals(requestData.url, `/qr/v1/merchant-redirect/${id}`);
  assertEquals(requestData.method, "PUT");
});

Deno.test("redirectQR - info - should return a RequestData object with the correct properties", () => {
  const token = "my-auth-token";
  const id = "12345";
  const imageFormat = "image/png";

  const requestData = redirectQRRequestFactory.info(token, id, imageFormat);

  assertEquals(requestData.url, `/qr/v1/merchant-redirect/${id}`);
  assertEquals(requestData.method, "GET");
});

Deno.test("redirectQR - list - should return the correct request data", () => {
  const token = "your-token";
  const imageFormat = "image/png";

  const requestData = redirectQRRequestFactory.list(token, imageFormat);

  assertEquals(requestData.url, `/qr/v1/merchant-redirect`);
  assertEquals(requestData.method, "GET");
});

Deno.test("redirectQR - delete - should return the correct request data", () => {
  const token = "your-token";
  const id = "12345";

  const requestData = redirectQRRequestFactory.delete(token, id);

  assertEquals(requestData.url, `/qr/v1/merchant-redirect/${id}`);
  assertEquals(requestData.method, "DELETE");
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

  assertEquals(requestData.url, "/qr/v1/merchant-callback/your-merchant-qr-id");
  assertEquals(requestData.method, "PUT");
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

  assertEquals(
    requestData.url,
    "/qr/v1/merchant-callback/your-merchant-qr-id?QrImageFormat=PNG&QrImageSize=200",
  );
  assertEquals(requestData.method, "GET");
});

Deno.test("callbackQR - info - should return a valid request data object without image format and size set", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";

  const requestData = callbackQRRequestFactory.info(
    token,
    merchantQrId,
  );

  assertEquals(
    requestData.url,
    "/qr/v1/merchant-callback/your-merchant-qr-id?QrImageFormat=SVG",
  );
});

Deno.test("callbackQR - list - should return a valid request data object", () => {
  const token = "your-auth-token";
  const qrImageFormat = "PNG";
  const qrImageSize = 200;

  const requestData = callbackQRRequestFactory.list(
    token,
    qrImageFormat,
    qrImageSize,
  );

  assertEquals(
    requestData.url,
    "/qr/v1/merchant-callback?QrImageFormat=PNG&QrImageSize=200",
  );
  assertEquals(requestData.method, "GET");
});

Deno.test("callbackQR - list - should return a valid request data object without image format and size set", () => {
  const token = "your-auth-token";

  const requestData = callbackQRRequestFactory.list(token);

  assertEquals(requestData.url, "/qr/v1/merchant-callback?QrImageFormat=SVG");
});

Deno.test("callbackQR - delete - should return a valid request data object", () => {
  const token = "your-auth-token";
  const merchantQrId = "your-merchant-qr-id";

  const requestData = callbackQRRequestFactory.delete(token, merchantQrId);

  assertEquals(requestData.url, "/qr/v1/merchant-callback/your-merchant-qr-id");
  assertEquals(requestData.method, "DELETE");
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

  assertEquals(
    requestData.url,
    "/qr/v1/merchant-callback/mobilepay/your-beacon-id",
  );
  assertEquals(requestData.method, "PUT");
});

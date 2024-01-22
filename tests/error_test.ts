import { AccessTokenError } from "../src/apis/types/auth_types.ts";
import { EPaymentErrorResponse } from "../src/apis/types/epayment_types.ts";
import { QrErrorResponse } from "../src/apis/types/qr_types.ts";
import { parseError, parseProblemJSON } from "../src/errors.ts";
import { Client } from "../src/mod.ts";
import { assertEquals, mf } from "./test_deps.ts";

////// Parse Error Tests //////

Deno.test("parseError - Should return correct error message for connection error", () => {
  const error = new TypeError("error trying to connect");
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, "Could not connect to Vipps MobilePay API");
});

Deno.test("parseError - Should return correct error message for generic Error", () => {
  const error = new Error("Some error message");
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `${error.name} - ${error.message}`);
});

Deno.test("parseError - should return correct error message for forbidden Error", async () => {
  mf.install();
  mf.mock("GET@/epayment/v1/payments/", () => {
    return new Response(JSON.stringify({ ok: false, data: {} }), {
      status: 403,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const result = await client.payment.info("testtoken", "123456789");
  assertEquals(result.ok, false);
  mf.reset();
});

Deno.test("parseError - Should return correct error message for AccessTokenError", () => {
  const error: AccessTokenError = {
    error: "access_token_error",
    error_description: "Invalid access token",
    trace_id: "123456789",
    correlation_id: "987654321",
    error_codes: [123, 456],
    error_uri: "https://example.com/error",
    timestamp: new Date(),
  };
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `${error.error} - ${error.error_description}`);
  assertEquals(result.error, error);
});

Deno.test("parseError should return correct error message for unknown error", () => {
  const error = "Unknown error";
  const result = parseError(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Unknown error");
});

////// Parse Problem JSON Tests //////
Deno.test("parseProblemJSON - Should return correct error message for Problem JSON", () => {
  const error = {
    type: "https://example.com/error",
    title: "Some problem",
    status: 400,
    instance: "https://example.com/instance",
    traceId: "123456789",
    detail: "Some detail",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `${error.detail}`);
});

Deno.test("parseProblemJSON - Should return correct error message for Problem JSON", () => {
  const error: EPaymentErrorResponse = {
    type: "https://example.com/error",
    title: "Some problem",
    status: 400,
    extraDetails: [{
      name: "Some name",
      reason: "Some reason",
    }],
    instance: "https://example.com/instance",
    traceId: "123456789",
    detail: "Some detail",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `Some name - Some reason`);
  assertEquals(result.error, error);
});

Deno.test("parseProblemJSON - Should return detail as error message for QRErrorJSON", () => {
  const error = {
    title: "Invalid QR code",
    detail: "The QR code is expired",
    instance: "https://example.com/qr",
  };
  const result = parseProblemJSON(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, "The QR code is expired");
});

Deno.test("parseProblemJSON - Should return reason as error message for QRErrorJSON", () => {
  const error: QrErrorResponse = {
    title: "Invalid QR code",
    detail: "The QR code is expired",
    instance: "https://example.com/qr",
    invalidParams: [
      {
        name: "Some name",
        reason: "Some reason",
      },
    ],
  };
  const result = parseProblemJSON(error);

  assertEquals(result.ok, false);
  assertEquals(result.message, "Some name - Some reason");
});

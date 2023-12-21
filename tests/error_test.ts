import { AccessTokenError } from "../src/apis/types/auth_types.ts";
import { EpaymentErrorResponse } from "../src/apis/types/epayment_types.ts";
import { RetryError } from "../src/deps.ts";
import { parseError } from "../src/errors.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("parseError - Should return correct error message for RetryError", () => {
  const error = new RetryError("foo", 3);
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(
    result.message,
    "Could not get a response from the server after multiple attempts",
  );
});

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

Deno.test("parseError should return correct error message for forbidden Error", () => {
  const error = new Error("Forbidden");
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, "Your credentials are not authorized for this product, please visit portal.vipps.no");
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

Deno.test("parseError - Should return correct error message for Problem JSON", () => {
  const error: EpaymentErrorResponse = {
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
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, `${error.status} - ${error.title}`);
  assertEquals(result.error, error);
});

Deno.test("parseError should return correct error message for unknown error", () => {
  const error = "Unknown error";
  const result = parseError(error);
  assertEquals(result.ok, false);
  assertEquals(result.message, String(error));
});

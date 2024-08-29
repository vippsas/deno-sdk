import type { AccessTokenError } from "../src/apis/types/auth_types.ts";
import { parseError } from "../src/errors.ts";
import { Client, type RecurringErrorFromAzure } from "../src/mod.ts";
import { assert, assertEquals, assertExists } from "@std/assert";
import { mockFetch } from "@c4spar/mock-fetch";

Deno.test("parseError - Should return correct error message for connection error", () => {
  const error = new TypeError("error trying to connect");
  const result = parseError(error);
  assertEquals(result.ok, false);
});

Deno.test("parseError - Should return correct error message for generic Error", () => {
  const error = new Error("Some error message");
  const result = parseError(error);
  assertEquals(result.ok, false);
});

Deno.test("parseError - should return correct error message for forbidden Error", async () => {
  mockFetch("https://apitest.vipps.no/epayment/v1/payments/", {
    body: JSON.stringify({ ok: false, data: {} }),
    status: 403,
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const result = await client.payment.info("testtoken", "123456789");
  assertEquals(result.ok, false);
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
  assertEquals(result.error, error);
});

Deno.test("parseError should return correct error message for unknown error", () => {
  const error = "Unknown error";
  const result = parseError(error);

  assertEquals(result.ok, false);
  assertExists(result.error);
  assert("message" in result.error);
  assertEquals(result.error.message, "Unknown error");
});

Deno.test("parseError - Should return correct error message for Recurring Azure Error", () => {
  const error: RecurringErrorFromAzure = {
    responseInfo: {
      responseCode: 123,
      responseMessage: "Response message",
    },
    result: {
      message: "Result message",
    },
  };
  const result = parseError(error);
  assertEquals(result.ok, false);
});

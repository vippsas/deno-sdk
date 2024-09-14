import { AccessTokenError } from "../src/types_external.ts";
import { parseError } from "../src/errors.ts";
import { Client } from "../src/mod.ts";
import { assert, assertExists } from "./test_deps.ts";
import { assertEquals, mf } from "./test_deps.ts";

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

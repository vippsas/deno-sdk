import { checkoutRequestFactory } from "../src/apis/checkout.ts";
import { assertEquals, assertExists, assertNotEquals } from "./test_deps.ts";

Deno.test("create - should return the correct request data", () => {
  const client_id = "your_client_id";
  const client_secret = "your_client_secret";
  const body = {
    merchantInfo: {
      callbackUrl: "https://example.com/vipps/callbacks-for-checkout",
      returnUrl:
        "https://example.com/vipps/fallback-result-page-for-both-success-and-failure",
      callbackAuthorizationToken: "1234",
    },
    transaction: {
      amount: {
        currency: "NOK",
        value: 1000,
      },
      reference: "foobar",
      paymentDescription: "One pair of socks.",
    },
  };

  const requestData = checkoutRequestFactory.create(
    client_id,
    client_secret,
    body,
  );

  assertEquals(requestData.url, "/checkout/v3/session");
  assertEquals(requestData.method, "POST");
  assertEquals(requestData.body, body);
  assertNotEquals(requestData.additionalHeaders, undefined);
  const headers = requestData.additionalHeaders as Record<string, string>;
  assertEquals("client_id" in headers, true);
});

Deno.test("create - should fill in missing properties", () => {
  const client_id = "your_client_id";
  const client_secret = "your_client_secret";
  const body = {
    merchantInfo: {
      callbackUrl: "https://example.com/vipps/callbacks-for-checkout",
      returnUrl:
        "https://example.com/vipps/fallback-result-page-for-both-success-and-failure",
    },
    transaction: {
      amount: {
        currency: "NOK",
        value: 1000,
      },
      paymentDescription: "One pair of socks.",
    },
  };

  const requestData = checkoutRequestFactory.create(
    client_id,
    client_secret,
    body,
    // deno-lint-ignore no-explicit-any
  ) as any;

  assertExists(requestData.body.transaction.reference);
  assertExists(requestData.body.merchantInfo.callbackAuthorizationToken);
});

Deno.test("info - should return the correct request data", () => {
  const client_id = "your_client_id";
  const client_secret = "your_client_secret";
  const reference = "your_reference";

  const requestData = checkoutRequestFactory.info(
    client_id,
    client_secret,
    reference,
  );

  assertEquals(requestData.url, `/checkout/v3/session/${reference}`);
  assertEquals(requestData.method, "GET");
});

import { checkoutRequestFactory } from "../src/apis/checkout.ts";
import { assertEquals, assertNotEquals } from "./test_deps.ts";

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
  assertNotEquals(requestData.headers, undefined);
  const headers = requestData.headers as Record<string, string>;
  assertEquals("client_id" in headers, true);
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

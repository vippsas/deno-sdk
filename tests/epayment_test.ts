import { assertEquals, assertExists } from "@std/assert";
import { ePaymentRequestFactory } from "../src/apis/epayment.ts";

Deno.test("ePayment - create - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments",
    method: "POST",
    body: {
      amount: { currency: "NOK", value: 1000 },
      paymentMethod: { type: "WALLET" },
      customer: { phoneNumber: "4712345678" },
      reference: "foo",
      returnUrl: "https://yourwebsite.come/redirect?reference=foo",
      userFlow: "WEB_REDIRECT",
      paymentDescription: "One pair of socks",
    },
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.create("testtoken", {
    amount: {
      currency: "NOK",
      value: 1000,
    },
    paymentMethod: {
      type: "WALLET",
    },
    customer: {
      phoneNumber: "4712345678",
    },
    reference: "foo",
    returnUrl: "https://yourwebsite.come/redirect?reference=foo",
    userFlow: "WEB_REDIRECT",
    paymentDescription: "One pair of socks",
  }) as unknown;

  assertEquals(actual, expected);
});

Deno.test("ePayment - create - Should fill in missing props", () => {
  const result = ePaymentRequestFactory.create(
    "test_token",
    {
      amount: {
        currency: "NOK",
        value: 1000,
      },
      paymentMethod: {
        type: "WALLET",
      },
      customer: {
        phoneNumber: "4712345678",
      },
      returnUrl: "https://yourwebsite.come/redirect?reference=" + "foo",
      userFlow: "WEB_REDIRECT",
      paymentDescription: "One pair of socks",
    },
    // deno-lint-ignore no-explicit-any
  ) as any;

  assertExists(result.body.reference);
});

Deno.test("ePayment - info - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments/foo",
    method: "GET",
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.info("testtoken", "foo") as unknown;

  assertEquals(actual, expected);
});

Deno.test("ePayment - history - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments/foo/events",
    method: "GET",
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.history("testtoken", "foo") as unknown;

  assertEquals(actual, expected);
});

Deno.test("ePayment - cancel - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments/foo/cancel",
    method: "POST",
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.cancel("testtoken", "foo") as unknown;
  assertEquals(actual, expected);
});

Deno.test("ePayment - capture - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments/foo/capture",
    method: "POST",
    body: { modificationAmount: { currency: "NOK", value: 1000 } },
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.capture("testtoken", "foo", {
    modificationAmount: {
      currency: "NOK",
      value: 1000,
    },
  }) as unknown;

  assertEquals(actual, expected);
});

Deno.test("ePayment - refund - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/payments/foo/refund",
    method: "POST",
    body: { modificationAmount: { currency: "NOK", value: 1000 } },
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.refund("testtoken", "foo", {
    modificationAmount: {
      currency: "NOK",
      value: 1000,
    },
  }) as unknown;

  assertEquals(actual, expected);
});

Deno.test("ePayment - forceApprove - Should have correct url and header", () => {
  const expected = {
    url: "/epayment/v1/test/payments/foo/approve",
    method: "POST",
    body: { customer: { phoneNumber: "4712345678" }, token: "foo" },
    token: "testtoken",
  };

  const actual = ePaymentRequestFactory.forceApprove("testtoken", "foo", {
    customer: {
      phoneNumber: "4712345678",
    },
    token: "foo",
  }) as unknown;

  assertEquals(actual, expected);
});

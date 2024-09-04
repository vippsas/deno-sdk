import { assertEquals } from "./test_deps.ts"
import { agreementRequestFactory } from "../src/apis/recurring.ts";

Deno.test("agreements - create - check correct url in TEST/MT", () => {
  const expected = {
    url: "/recurring/v3/agreements",
    method: "POST",
    body: {
      pricing: { type: "LEGACY", amount: 2500, currency: "NOK" },
      interval: { unit: "MONTH", count: 1 },
      merchantRedirectUrl: "https://example.com/redirect",
      merchantAgreementUrl: "https://example.com/agreement",
      phoneNumber: "4712345678",
      productName: "MyNews Digital",
    },
    token: "testtoken",
  };

  const actual = agreementRequestFactory.create("testtoken", {
    pricing: {
      type: "LEGACY",
      amount: 2500,
      currency: "NOK",
    },
    interval: {
      unit: "MONTH",
      count: 1,
    },
    merchantRedirectUrl: "https://example.com/redirect",
    merchantAgreementUrl: "https://example.com/agreement",
    phoneNumber: "4712345678",
    productName: "MyNews Digital",
  }) as unknown;

  assertEquals(actual, expected);
});

Deno.test("list - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const status = "ACTIVE";
  const createdAfter = 1628764800;

  const expected = {
    url: "/recurring/v3/agreements?status=ACTIVE&createdAfter=1628764800",
    method: "GET",
    token: "your-auth-token",
  };

  const actual = agreementRequestFactory.list(
    token,
    status,
    createdAfter,
  ) as unknown;

  assertEquals(actual, expected);
});

Deno.test("info - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";

  const expected = {
    url: "/recurring/v3/agreements/your-agreement-id",
    method: "GET",
    token: "your-auth-token",
  };

  const actual = agreementRequestFactory.info(token, agreementId) as unknown;

  assertEquals(actual, expected);
});

Deno.test("update - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";
  const body = { pricing: { amount: 1000, suggestedMaxAmount: 10000 } };

  const expected = {
    url: "/recurring/v3/agreements/your-agreement-id",
    method: "PATCH",
    body: { pricing: { amount: 1000, suggestedMaxAmount: 10000 } },
    token: "your-auth-token",
  };

  const actual = agreementRequestFactory.update(
    token,
    agreementId,
    body,
  ) as unknown;

  assertEquals(actual, expected);
});

Deno.test("forceAccept - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";
  const body = { phoneNumber: "4791234567" };

  const actual = agreementRequestFactory.forceAccept(
    token,
    agreementId,
    body,
  ) as unknown;

  const expected = {
    url: "/recurring/v3/agreements/your-agreement-id/accept",
    method: "PATCH",
    body: { phoneNumber: "4791234567" },
    token: "your-auth-token",
  };

  assertEquals(actual, expected);
});

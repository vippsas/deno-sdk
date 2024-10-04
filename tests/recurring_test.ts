import { assert, assertEquals } from "@std/assert";
import {
  agreementRequestFactory,
  chargeRequestFactory,
} from "../src/apis/recurring.ts";

Deno.test("create - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";

  const requestData = chargeRequestFactory.create(token, agreementId, {
    amount: 1000,
    transactionType: "DIRECT_CAPTURE",
    type: "RECURRING",
    description: "Test charge",
    due: "2030-12-31",
    retryDays: 5,
    externalId: "test-charge-123",
    orderId: "test-order-123",
  });

  assert(requestData.url, `/recurring/v3/agreements/${agreementId}/charges`);
  assert(requestData.method, "POST");
});

Deno.test("create multiple - should return the correct RequestData object", () => {
  const token = "your-auth-token";

  const requestData = chargeRequestFactory.createMultiple(token, [{
    amount: 1000,
    transactionType: "DIRECT_CAPTURE",
    agreementId: "your-agreement-id",
    description: "Test charge",
    due: "2030-12-31",
    retryDays: 5,
    externalId: "test-charge-123",
    orderId: "test-order-123",
  }]);

  assert(requestData.url, `/recurring/v3/agreements/charges`);
  assert(requestData.method, "POST");
});

Deno.test("info - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";
  const chargeId = "your-charge-id";

  const requestData = chargeRequestFactory.info(token, agreementId, chargeId);

  assert(
    requestData.url,
    `/recurring/v3/agreements/${agreementId}/charges/${chargeId}`,
  );
  assert(requestData.method, "GET");
});

Deno.test("infoById should return the correct RequestData object", () => {
  const token = "your-access-token";
  const chargeId = "your-charge-id";

  const requestData = chargeRequestFactory.infoById(token, chargeId);

  assert(requestData.url, "/recurring/v3/agreements/charges/your-charge-id");
  assert(requestData.method, "GET");
});

Deno.test("list should return the correct RequestData object", () => {
  const token = "your-access-token";
  const agreementId = "your-agreement-id";
  const status = "CHARGED";

  const requestData = chargeRequestFactory.list(token, agreementId, status);

  assert(
    requestData.url,
    "/recurring/v3/agreements/your-agreement-id/charges?status=CHARGED",
  );
  assert(requestData.method, "GET");
});

Deno.test("list should return the correct RequestData object without search query", () => {
  const token = "your-access-token";
  const agreementId = "your-agreement-id";

  const requestData = chargeRequestFactory.list(token, agreementId);

  assert(
    requestData.url,
    "/recurring/v3/agreements/your-agreement-id/charges",
  );
});

Deno.test("cancel should return the correct RequestData object", () => {
  const token = "your-access-token";
  const agreementId = "your-agreement-id";
  const chargeId = "your-charge-id";

  const requestData = chargeRequestFactory.cancel(token, agreementId, chargeId);

  assert(
    requestData.url,
    "/recurring/v3/agreements/your-agreement-id/charges/your-charge-id",
  );
  assert(requestData.method, "DELETE");
});

Deno.test("capture should return the correct RequestData object", () => {
  const token = "your-access-token";
  const agreementId = "your-agreement-id";
  const chargeId = "your-charge-id";
  const body = { amount: 1000, description: "Test charge" };

  const requestData = chargeRequestFactory.capture(
    token,
    agreementId,
    chargeId,
    body,
  );

  assert(
    requestData.url,
    "/recurring/v3/agreements/your-agreement-id/charges/your-charge-id/capture",
  );
  assert(requestData.method, "POST");
});

Deno.test("refund should return the correct RequestData object", () => {
  const token = "your-access-token";
  const agreementId = "your-agreement-id";
  const chargeId = "your-charge-id";
  const body = { amount: 1000, description: "Test charge" };

  const requestData = chargeRequestFactory.refund(
    token,
    agreementId,
    chargeId,
    body,
  );

  assert(
    requestData.url,
    "/recurring/v3/agreements/your-agreement-id/charges/your-charge-id/refund",
  );
  assert(requestData.method, "POST");
});

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

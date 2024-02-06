import { assert } from "./test_deps.ts";
import { chargeRequestFactory } from "../src/apis/recurring.ts";

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

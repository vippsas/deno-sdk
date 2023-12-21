import { assertEquals, mf } from "./test_deps.ts";
import { Client } from "../src/mod.ts";
import { agreementRequestFactory } from "../src/apis/agreement.ts";

Deno.test("agreements - create - check correct url in TEST/MT", async () => {
  mf.install();

  mf.mock("POST@/recurring/v3/agreements", (req: Request) => {
    assertEquals(req.url, "https://apitest.vipps.no/recurring/v3/agreements");
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({ ok: true, data: {} }), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const result = await client.agreement.create("testtoken", {
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
  });

  assertEquals(result.ok, true);

  mf.reset();
});

Deno.test("list - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const status = "ACTIVE";
  const createdAfter = 1628764800;

  const requestData = agreementRequestFactory.list(token, status, createdAfter);

  assertEquals(
    requestData.url,
    `/recurring/v3/agreements?status=${status}&createdAfter=${createdAfter}`,
  );
  assertEquals(requestData.method, "GET");
});

Deno.test("info - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";

  const requestData = agreementRequestFactory.info(token, agreementId);

  assertEquals(
    requestData.url,
    `/recurring/v3/agreements/${agreementId}`,
  );
  assertEquals(requestData.method, "GET");
});

Deno.test("update - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";
  const body = { pricing: { amount: 1000, suggestedMaxAmount: 10000 } };

  const requestData = agreementRequestFactory.update(token, agreementId, body);

  assertEquals(
    requestData.url,
    `/recurring/v3/agreements/${agreementId}`,
  );
  assertEquals(requestData.method, "PATCH");
  assertEquals(requestData.body, body);
});

Deno.test("forceAccept - should return the correct RequestData object", () => {
  const token = "your-auth-token";
  const agreementId = "your-agreement-id";
  const body = { phoneNumber: "4791234567" };

  const requestData = agreementRequestFactory.forceAccept(
    token,
    agreementId,
    body,
  );

  assertEquals(
    requestData.url,
    `/recurring/v3/agreements/${agreementId}/accept`,
  );
  assertEquals(requestData.method, "PATCH");
  assertEquals(requestData.body, body);
});

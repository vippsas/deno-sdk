import { assertEquals, mf } from "./test_deps.ts";
import { Client } from "../src/mod.ts";
import { webhooksRequestFactory } from "https://deno.land/x/vipps_mobilepay_sdk@0.7.0/apis/webhooks.ts";

Deno.test("webhooks - registerWebhook - check correct url in TEST/MT", async () => {
  mf.install();

  mf.mock("POST@/webhooks/v1/webhooks", (req: Request) => {
    assertEquals(req.url, "https://apitest.vipps.no/webhooks/v1/webhooks");
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 201,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const result = await client.webhook.register("testtoken", {
    events: ["epayments.payment.created.v1", "user.checked-in.v1"],
    url: "https://example.com/hook/epayment",
  });

  assertEquals(result.ok, true);

  mf.reset();
});

Deno.test("webhooks - registerWebhook - bad request", async () => {
  mf.install();

  mf.mock("POST@/webhooks/v1/webhooks", () => {
    return new Response("Bad request", {
      status: 400,
      statusText: "Bad Request",
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const result = await client.webhook.register("testtoken", {
    events: [
      "epayments.payment.created.v1",
      "user.checked-in.v1",
    ],
    url: "http://localhost:8080/hook/epayment",
  });

  assertEquals(result.ok, false);

  mf.reset();
});

Deno.test("webhooks - delete webhook - OK", async () => {
  mf.install();

  // Testing that 204 responses are handled correctly
  mf.mock("DELETE@/webhooks/v1/webhooks/:webhookId", () => {
    return new Response(null, {
      status: 204,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const deleteResponse = await client.webhook.delete(
    "testtoken",
    "1234-1234-1234-1234-1234",
  );

  assertEquals(deleteResponse.ok, true);

  mf.reset();
});

Deno.test("webhooks - list webhooks - OK", () => {
  const token = "your-auth-token";

  const requestData = webhooksRequestFactory.list(token);

  assertEquals(requestData.url, "/webhooks/v1/webhooks");
  assertEquals(requestData.method, "GET");
});

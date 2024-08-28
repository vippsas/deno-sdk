import { assertEquals } from "@std/assert";
import { mockFetch, resetFetch } from "@c4spar/mock-fetch";
import { Client } from "../src/mod.ts";

Deno.test("webhooks - registerWebhook - check correct url in TEST/MT", async () => {
  mockFetch("https://apitest.vipps.no/webhooks/v1/webhooks", {
    body: JSON.stringify({}),
    status: 201,
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

  resetFetch();
});

Deno.test("webhooks - registerWebhook - bad request", async () => {
  mockFetch("https://apitest.vipps.no/webhooks/v1/webhooks", {
    status: 400,
    statusText: "Bad Request",
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

  resetFetch();
});

Deno.test("webhooks - delete webhook - OK", async () => {
  // Testing that 204 responses are handled correctly
  mockFetch("https://apitest.vipps.no/webhooks/v1/webhooks/:webhookId", {
    status: 204,
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

  resetFetch();
});

Deno.test("webhooks - list webhooks - OK", async () => {
  mockFetch("https://apitest.vipps.no/webhooks/v1/webhooks", {
    body: JSON.stringify({
      webhooks: [
        {
          id: "1234-1234-1234-1234-1234",
          url: "https://example.com/hook/epayment",
          events: [
            "epayments.payment.created.v1",
            "user.checked-in.v1",
          ],
        },
      ],
    }),
    status: 200,
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  const listResponse = await client.webhook.list("testtoken");

  assertEquals(listResponse.ok, true);

  resetFetch();
});

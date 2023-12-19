import { assertEquals, mf } from "./test_deps.ts";
import { Client } from "../src/mod.ts";

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

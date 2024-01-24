import { assertEquals, assertExists, mf } from "./test_deps.ts";
import { Client } from "../src/mod.ts";
import { ePaymentRequestFactory } from "../src/apis/epayment.ts";

Deno.test("ePayment - create - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("POST@/epayment/v1/payments", (req: Request) => {
    assertEquals(req.url, "https://apitest.vipps.no/epayment/v1/payments");
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.create("testtoken", {
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
    returnUrl: "https://yourwebsite.come/redirect?reference=" + "foo",
    userFlow: "WEB_REDIRECT",
    paymentDescription: "One pair of socks",
  });

  mf.reset();
});

Deno.test("ePayment - create - Should fill in missing props", () => {
  const requestData = ePaymentRequestFactory.create(
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
  );

  assertExists(requestData.body);
  assertExists("reference" in requestData.body);
});

Deno.test("ePayment - info - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/epayment/v1/payments/foo", (req: Request) => {
    assertEquals(req.url, "https://apitest.vipps.no/epayment/v1/payments/foo");
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.info("testtoken", "foo");

  mf.reset();
});

Deno.test("ePayment - history - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/epayment/v1/payments/foo/events", (req: Request) => {
    assertEquals(
      req.url,
      "https://apitest.vipps.no/epayment/v1/payments/foo/events",
    );
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.history("testtoken", "foo");

  mf.reset();
});

Deno.test("ePayment - cancel - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("POST@/epayment/v1/payments/foo/cancel", (req: Request) => {
    assertEquals(
      req.url,
      "https://apitest.vipps.no/epayment/v1/payments/foo/cancel",
    );
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.cancel("testtoken", "foo");

  mf.reset();
});

Deno.test("ePayment - capture - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("POST@/epayment/v1/payments/foo/capture", (req: Request) => {
    assertEquals(
      req.url,
      "https://apitest.vipps.no/epayment/v1/payments/foo/capture",
    );
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.capture("testtoken", "foo", {
    modificationAmount: {
      currency: "NOK",
      value: 1000,
    },
  });

  mf.reset();
});

Deno.test("ePayment - refund - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("POST@/epayment/v1/payments/foo/refund", (req: Request) => {
    assertEquals(
      req.url,
      "https://apitest.vipps.no/epayment/v1/payments/foo/refund",
    );
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.refund("testtoken", "foo", {
    modificationAmount: {
      currency: "NOK",
      value: 1000,
    },
  });

  mf.reset();
});

Deno.test("ePayment - forceApprove - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("POST@/epayment/v1/test/payments/foo/approve", (req: Request) => {
    assertEquals(
      req.url,
      "https://apitest.vipps.no/epayment/v1/test/payments/foo/approve",
    );
    assertEquals(req.headers.has("Idempotency-Key"), true);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const client = Client({
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: false,
  });

  await client.payment.forceApprove("testtoken", "foo", {
    customer: {
      phoneNumber: "4712345678",
    },
    token: "foo",
  });

  mf.reset();
});

import { baseClient } from "../src/base_client.ts";
import { assertEquals, mf } from "./test_deps.ts"
import type { RequestData } from "../src/types.ts";
import { RetryError } from "../src/deps.ts";

Deno.test("makeRequest - Should return ok", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/foo", (req: Request) => {
    assertEquals(req.url, "https://api.vipps.no/foo");
    assertEquals(req.method, "GET");
    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const cfg = { merchantSerialNumber: "", subscriptionKey: "" };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, true);
});

Deno.test("makeRequest - Should error", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/foo", () => {
    return new Response(JSON.stringify({ ok: false, error: "Bad Request" }), {
      status: 400,
    });
  });

  const cfg = { merchantSerialNumber: "", subscriptionKey: "" };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, false);
});

Deno.test("makeRequest - Should return validation error", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/epayment/v1/test/payments/123abc/approve", () => {
    return new Response(JSON.stringify({ ok: false, error: "Bad Request" }), {
      status: 400,
    });
  });

  const cfg = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: false,
  };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/epayment/v1/test/payments/123abc/approve",
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, false);
});

Deno.test("makeRequest - Should return ok after 2 retries", async () => {
  mf.install(); // mock out calls to `fetch`
  let count = 0;
  mf.mock("GET@/foo", () => {
    count++;
    if (count < 3) {
      return new Response(
        JSON.stringify({ ok: false, error: "Internal Server Error" }),
        {
          status: 500,
        },
      );
    }

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const cfg = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    retryRequests: true,
  };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);

  const response = await client.makeRequest(requestData);
  assertEquals(response.ok, true);

  mf.reset();
});

Deno.test("makeRequest - Should not return ok after 4 retries", async () => {
  mf.install(); // mock out calls to `fetch`
  let count = 0;
  mf.mock("GET@/foo", () => {
    count++;
    if (count < 5) {
      return new Response(
        JSON.stringify({ ok: false, error: "Internal Server Error" }),
        {
          status: 500,
        },
      );
    }
    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const cfg = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    retryRequests: true,
  };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);

  const response = await client.makeRequest(requestData);
  assertEquals(response.ok, false);

  mf.reset();
});

Deno.test("makeRequest - Should catch Retry Errors", async () => {
  mf.install(); // mock out calls to `fetch`
  mf.mock("GET@/foo", () => {
    throw new RetryError({ foo: "bar" }, 3);
  });

  const cfg = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    retryRequests: true,
  };
  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);

  const response = await client.makeRequest(requestData);
  assertEquals(response.ok, false);
  mf.reset();
});
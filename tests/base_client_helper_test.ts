import {
  buildRequest,
  createSDKUserAgent,
  fetchJSON,
  getHeaders,
} from "../src/base_client_helper.ts";
import { ClientConfig, RequestData } from "../src/types.ts";
import { assert, assertEquals, mf } from "./test_deps.ts";

Deno.test("fetchJSON - Returns successful response", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      statusText: "OK",
    });
  });

  const request = new Request("https://example.com/api");

  const result = await fetchJSON(request);
  assertEquals(result, { ok: true, data: { message: "Success" } });
});

Deno.test("fetchJSON - Returns parseError on Bad Request", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      statusText: "Bad Request",
    });
  });

  const request = new Request("https://example.com/api");
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;
  assertEquals(result.ok, false);
  assert(result.message !== undefined);
});

Deno.test("buildRequest - Should return a Request object with the correct properties", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    useTestMode: true,
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "POST",
    token: "your-token",
    url: "/your-endpoint",
    body: { key: "value" },
  };

  const expectedBaseURL = "https://apitest.vipps.no";
  const expectedReqInit = {
    method: "POST",
    body: JSON.stringify({ key: "value" }),
  };

  const expectedRequest = buildRequest(cfg, requestData);

  assertEquals(expectedRequest.url, `${expectedBaseURL}${requestData.url}`);
  assertEquals(expectedRequest.method, expectedReqInit.method);
  assert(expectedRequest.body !== undefined);
});

Deno.test("getHeaders - Should return correct with input", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    systemName: "My Ecommerce System",
    systemVersion: "1.0.0",
    pluginName: "My cool plugin",
    pluginVersion: "1.0.0",
    retryRequests: false,
    useTestMode: true,
  };

  const expectedHeaders = getHeaders(cfg, "testToken");

  assertEquals(expectedHeaders["Content-Type"], "application/json");
  assertEquals(expectedHeaders["Authorization"], "Bearer testToken");
  assertEquals(expectedHeaders["Ocp-Apim-Subscription-Key"], "testKey");
  assertEquals(expectedHeaders["Merchant-Serial-Number"], "123456");
  assertEquals(expectedHeaders["Vipps-System-Name"], "My Ecommerce System");
  assertEquals(expectedHeaders["Vipps-System-Version"], "1.0.0");
  assertEquals(expectedHeaders["Vipps-System-Plugin-Name"], "My cool plugin");
  assertEquals(expectedHeaders["Vipps-System-Plugin-Version"], "1.0.0");
});

Deno.test("getHeaders - Should return correct with minimal input", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
  };

  const expectedHeaders = getHeaders(cfg);

  assertEquals(expectedHeaders["Content-Type"], "application/json");
  assertEquals(expectedHeaders["Authorization"], "Bearer ");
  assertEquals(expectedHeaders["Ocp-Apim-Subscription-Key"], "testKey");
  assertEquals(expectedHeaders["Merchant-Serial-Number"], "123456");
  assertEquals(expectedHeaders["Vipps-System-Name"], "");
  assertEquals(expectedHeaders["Vipps-System-Version"], "");
  assertEquals(expectedHeaders["Vipps-System-Plugin-Name"], "");
  assertEquals(expectedHeaders["Vipps-System-Plugin-Version"], "");
  assert(expectedHeaders["User-Agent"] !== undefined);
  assert(expectedHeaders["Idempotency-Key"] !== undefined);
});

Deno.test("getHeaders - Should return correct with additional headers", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", { "foo": "bar" });

  assert(expectedHeaders["foo"] === "bar");
});

Deno.test("getHeaders - Additional headers should not overwrite default headers", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", {
    "Merchant-Serial-Number": "foobar",
  });

  assert(expectedHeaders["Merchant-Serial-Number"] === "123456");
});

Deno.test("getHeaders - Should omit headers", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", {}, [
    "Merchant-Serial-Number",
  ]);

  assert(expectedHeaders["Merchant-Serial-Number"] === undefined);
});

Deno.test("createUserAgent - Should return the correct user agent string when loaded from deno.land/x", () => {
  const expectedUserAgent = "Vipps/Deno SDK/1.0.0";
  const actualUserAgent = createSDKUserAgent(
    "https://deno.land/x/vipps_mobilepay_sdk@1.0.0/mod.ts",
  );

  assertEquals(actualUserAgent, expectedUserAgent);
});

Deno.test("createUserAgent - Should return the correct user agent string when loaded from node_modules", () => {
  const expectedUserAgent = "Vipps/Deno SDK/npm-module";
  const actualUserAgent = createSDKUserAgent(
    "file:///Users/foo/bar/node_modules/mod.ts",
  );

  assertEquals(actualUserAgent, expectedUserAgent);
});

Deno.test("createUserAgent - Should return the correct user agent string with unknown", () => {
  const expectedUserAgent = "Vipps/Deno SDK/unknown";
  const actualUserAgent = createSDKUserAgent("https://example.com/");

  assertEquals(actualUserAgent, expectedUserAgent);
});

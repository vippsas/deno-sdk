import {
  buildRequest,
  createSDKUserAgent,
  getHeaders,
} from "../src/base_client_helper.ts";
import { uuid } from "../src/deps.ts";
import { ClientConfig, RequestData } from "../src/types.ts";
import { assert, assertEquals } from "@std/assert";

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

Deno.test("buildRequest - Should set correct prod baseURL", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    useTestMode: false,
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "POST",
    token: "your-token",
    url: "/your-endpoint",
    body: { key: "value" },
  };

  const expectedBaseURL = "https://api.vipps.no";

  const expectedRequest = buildRequest(cfg, requestData);

  assertEquals(expectedRequest.url, `${expectedBaseURL}${requestData.url}`);
});

Deno.test("buildRequest - Should set correct test baseURL", () => {
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

  const expectedRequest = buildRequest(cfg, requestData);

  assertEquals(expectedRequest.url, `${expectedBaseURL}${requestData.url}`);
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

Deno.test("getHeaders - Should generate UUID", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
  };

  const expectedHeaders = getHeaders(cfg);
  const key = expectedHeaders["Idempotency-Key"];

  assert(uuid.validate(key));
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

Deno.test("createUserAgent - Should return the correct user agent for require", () => {
  const expectedUserAgent = "Vipps/Deno SDK/npm-require";
  const actualUserAgent = createSDKUserAgent(undefined);

  assertEquals(actualUserAgent, expectedUserAgent);
});

Deno.test("createUserAgent - Should return the correct user agent string when loaded from deno.land/x", () => {
  const expectedUserAgent = "Vipps/Deno SDK/1.2.0";
  const actualUserAgent = createSDKUserAgent(
    "https://deno.land/x/vipps_mobilepay_sdk@1.2.0/mod.ts",
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

Deno.test("createSDKUserAgent - Should return the correct user agent when loaded from an unknown source", () => {
  const metaUrl = "https://example.com/some/other/path/mod.ts";
  const expectedUserAgent = "Vipps/Deno SDK/unknown";

  const userAgent = createSDKUserAgent(metaUrl);

  assertEquals(userAgent, expectedUserAgent);
});

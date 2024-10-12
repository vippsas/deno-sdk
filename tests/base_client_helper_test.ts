import {
  buildRequest,
  getHeaders,
  getModuleSource,
  getUserAgent,
} from "../src/base_client_helper.ts";
import { uuid } from "../src/deps.ts";
import type { InternalConfig, RequestData } from "../src/types_internal.ts";
import { assert, assertEquals } from "@std/assert";

Deno.test("buildRequest - Should return a Request object with the correct properties", () => {
  const cfg: InternalConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    useTestMode: true,
    version: "1.0.0",
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
  const cfg: InternalConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    useTestMode: false,
    version: "1.0.0",
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
  const cfg: InternalConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    useTestMode: true,
    version: "1.0.0",
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
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    systemName: "My Ecommerce System",
    systemVersion: "1.0.0",
    pluginName: "My cool plugin",
    pluginVersion: "1.0.0",
    retryRequests: false,
    useTestMode: true,
    version: "1.0.0",
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
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    version: "1.0.0",
  };

  const expectedHeaders = getHeaders(cfg);
  const key = expectedHeaders["Idempotency-Key"];

  assert(uuid.validate(key));
});

Deno.test("getHeaders - Should return correct with minimal input", () => {
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    version: "1.0.0",
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
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    version: "1.0.0",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", { "foo": "bar" });

  assert(expectedHeaders["foo"] === "bar");
});

Deno.test("getHeaders - Additional headers should not overwrite default headers", () => {
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    version: "1.0.0",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", {
    "Merchant-Serial-Number": "foobar",
  });

  assert(expectedHeaders["Merchant-Serial-Number"] === "123456");
});

Deno.test("getHeaders - Should omit headers", () => {
  const cfg: InternalConfig = {
    subscriptionKey: "testKey",
    merchantSerialNumber: "123456",
    version: "1.0.0",
  };

  const expectedHeaders = getHeaders(cfg, "testToken", {}, [
    "Merchant-Serial-Number",
  ]);

  assert(expectedHeaders["Merchant-Serial-Number"] === undefined);
});

Deno.test("getUserAgent - with npm-require", () => {
  const version = "1.0.0";
  const moduleUrl = undefined;
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/npm-require/${version}`;
  assertEquals(result, expected);
});

Deno.test("getUserAgent - with npm-module", () => {
  const version = "1.0.0";
  const moduleUrl = "file:///path/to/node_modules/some_module";
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/npm-module/${version}`;
  assertEquals(result, expected);
});

Deno.test("getUserAgent - with jsr-npm", () => {
  const version = "1.0.0";
  const moduleUrl = "https://npm.jsr.io/some/path";
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/jsr-npm/${version}`;
  assertEquals(result, expected);
});

Deno.test("getUserAgent - with jsr", () => {
  const version = "1.0.0";
  const moduleUrl = "https://jsr.io/some/path";
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/jsr/${version}`;
  assertEquals(result, expected);
});

Deno.test("getUserAgent - with deno-land", () => {
  const version = "1.0.0";
  const moduleUrl = "https://deno.land/x/some_module";
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/deno-land/${version}`;
  assertEquals(result, expected);
});

Deno.test("getUserAgent - with unknown", () => {
  const version = "1.0.0";
  const moduleUrl = "https://unknown.host/some/path";
  const result = getUserAgent(version, moduleUrl);
  const expected = `Vipps/Deno-SDK/unknown/${version}`;
  assertEquals(result, expected);
});

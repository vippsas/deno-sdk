import {
  buildRequest,
  createSDKUserAgent,
  fetchJSON,
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
    useTestMode: true,
    retryRequests: false,
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
    systemName: "your-system-name",
    systemVersion: "your-system-version",
    pluginName: "your-plugin-name",
    pluginVersion: "your-plugin-version",
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-token",
    },
    token: "your-token",
    url: "/your-endpoint",
    body: { key: "value" },
  };

  const expectedBaseURL = "https://apitest.vipps.no";
  const expectedReqInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-token",
      "User-Agent": "Vipps/Deno SDK/local",
      "Ocp-Apim-Subscription-Key": "your-subscription-key",
      "Merchant-Serial-Number": "your-merchant-serial-number",
      "Vipps-System-Name": "your-system-name",
      "Vipps-System-Version": "your-system-version",
      "Vipps-System-Plugin-Name": "your-plugin-name",
      "Vipps-System-Plugin-Version": "your-plugin-version",
      "Idempotency-Key": "your-random-uuid",
    },
    body: JSON.stringify({ key: "value" }),
  };

  const request = buildRequest(cfg, requestData);

  assertEquals(request.url, `${expectedBaseURL}${requestData.url}`);
  assertEquals(request.method, expectedReqInit.method);

  const checkHeaderKeys = Object.keys(expectedReqInit.headers).every((key) =>
    request.headers.has(key)
  );
  assert(checkHeaderKeys);
});

Deno.test("buildRequest - Should return a Request object when filling in missing properties", () => {
  const cfg: ClientConfig = {
    subscriptionKey: "your-subscription-key",
    merchantSerialNumber: "your-merchant-serial-number",
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/your-endpoint",
  };

  const expectedBaseURL = "https://api.vipps.no";
  const expectedReqInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer",
      "User-Agent": "Vipps/Deno SDK/local",
      "Ocp-Apim-Subscription-Key": "your-subscription-key",
      "Merchant-Serial-Number": "your-merchant-serial-number",
      "Vipps-System-Name": "",
      "Vipps-System-Version": "",
      "Vipps-System-Plugin-Name": "",
      "Vipps-System-Plugin-Version": "",
      "Idempotency-Key": "your-random-uuid",
    },
    body: JSON.stringify({ key: "value" }),
  };

  const request = buildRequest(cfg, requestData);

  assertEquals(request.url, `${expectedBaseURL}${requestData.url}`);
  assertEquals(request.method, expectedReqInit.method);
  assertEquals(request.headers.get("Authorization"), expectedReqInit.headers.Authorization);

  const checkHeaderKeys = Object.keys(expectedReqInit.headers).every((key) =>
    request.headers.has(key)
  );
  assert(checkHeaderKeys);
});

Deno.test("createUserAgent - Should return the correct user agent string when loaded from deno.land/x", () => {
  const expectedUserAgent = "Vipps/Deno SDK/1.0.0";
  const actualUserAgent = createSDKUserAgent(
    "https://deno.land/x/vipps_mobilepay_sdk@1.0.0/mod.ts",
  );

  assertEquals(actualUserAgent, expectedUserAgent);
});

Deno.test("createUserAgent - Should return the correct user agent string when loaded locally", () => {
  const expectedUserAgent = "Vipps/Deno SDK/local";
  const actualUserAgent = createSDKUserAgent(
    "file:///Users/foo/bar/deno-sdk/src/mod.ts",
  );

  assertEquals(actualUserAgent, expectedUserAgent);
});

Deno.test("createUserAgent - Should return the correct user agent string with unknown", () => {
  const expectedUserAgent = "Vipps/Deno SDK/unknown";
  const actualUserAgent = createSDKUserAgent("https://example.com/");

  assertEquals(actualUserAgent, expectedUserAgent);
});

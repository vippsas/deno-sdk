import {
  buildRequest,
  fetchJSON,
  validateRequestData,
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
      "User-Agent": "Deno SDK/0.0.1",
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

Deno.test("validateRequestData - Should return undefined for valid request data", () => {
  const requestData: RequestData<unknown, unknown> = {
    url: "/api/endpoint",
    method: "POST",
  };
  const cfg: ClientConfig = { merchantSerialNumber: "", subscriptionKey: "" };

  const result = validateRequestData(requestData, cfg);

  assertEquals(result, undefined);
});

Deno.test("validateRequestData - Should return error message when using forceApprove in Production", () => {
  const requestData: RequestData<unknown, unknown> = {
    url: "/epayment/approve",
    method: "POST",
  };
  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: false,
    retryRequests: false,
  };

  const result = validateRequestData(requestData, cfg);

  assertEquals(
    result,
    "forceApprove is only available in the test environment",
  );
});

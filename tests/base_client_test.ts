import { baseClient } from "../src/base_client.ts";
import { assert, assertEquals } from "@std/assert";
import { ClientConfig, RequestData } from "../src/types.ts";
import { mockFetch, MockResponseOptions, resetFetch } from "@c4spar/mock-fetch";

const emptyCfg: ClientConfig = {
  merchantSerialNumber: "",
  subscriptionKey: "",
  useTestMode: true,
  retryRequests: false,
};

Deno.test("makeRequest - Should exist", () => {
  const client = baseClient(emptyCfg);

  assertEquals(typeof client.makeRequest, "function");
});

Deno.test("makeRequest - Should return", async () => {
  mockFetch("https://apitest.vipps.no/foo", {
    body: JSON.stringify({}),
    status: 200,
  });

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(emptyCfg);
  const actual = await client.makeRequest(requestData) as unknown;
  const expected = { ok: true, data: { text: "{}" } };

  assertEquals(expected, actual);
});

Deno.test("makeRequest - Should error", async () => {
  mockFetch("https://apitest.vipps.no/foo", {
    body: JSON.stringify({ ok: false, error: "Bad Request" }),
    status: 400,
  });

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(emptyCfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, false);

  resetFetch();
});

Deno.test("makeRequest - Should return validation error", async () => {

  mockFetch("https://api.vipps.no/epayment/v1/test/payments/123abc/approve", {
    body: JSON.stringify({ ok: false, error: "Bad Request" }),
    status: 400,
  });

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/epayment/v1/test/payments/123abc/approve",
  };

  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: false,
    retryRequests: false,
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, false);
  assert("error" in response);
});

Deno.test("makeRequest - Should return ok after 2 retries", async () => {
  const retries = 2;

  // Function to create mock response based on the attempt number
  const createResponse = (
    attempt: number,
    maxRetries: number,
  ): MockResponseOptions => ({
    body: JSON.stringify({
      ok: attempt >= maxRetries,
      error: attempt < maxRetries ? "Internal Server Error" : undefined,
    }),
    status: attempt < maxRetries ? 500 : 200,
  });

  // Mock fetch responses for each retry attempt using recursion
  const setupMockFetch = (maxRetries: number, attempt: number = 0): void => {
    if (attempt > maxRetries) return;
    mockFetch(
      "https://apitest.vipps.no/foo",
      createResponse(attempt, maxRetries),
    );
    setupMockFetch(maxRetries, attempt + 1);
  };

  setupMockFetch(retries);

  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: true,
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);

  assertEquals(response.ok, true);
});

Deno.test("makeRequest - Should give up and return return error after 3 retries", async () => {
  const retries = 3;

  // Function to create mock response based on the attempt number
  const createResponse = (
    attempt: number,
    maxRetries: number,
  ): MockResponseOptions => ({
    body: JSON.stringify({
      ok: attempt >= maxRetries,
      error: attempt < maxRetries ? "Internal Server Error" : undefined,
    }),
    status: attempt < maxRetries ? 500 : 200,
  });

  // Mock fetch responses for each retry attempt using recursion
  const setupMockFetch = (maxRetries: number, attempt: number = 0): void => {
    if (attempt > maxRetries) return;
    mockFetch(
      "https://apitest.vipps.no/foo",
      createResponse(attempt, maxRetries),
    );
    setupMockFetch(maxRetries, attempt + 1);
  };

  setupMockFetch(retries);

  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: true,
    retryRequests: true,
  };

  const requestData: RequestData<unknown, unknown> = {
    method: "GET",
    url: "/foo",
  };

  const client = baseClient(cfg);
  const response = await client.makeRequest(requestData);  

  assertEquals(response.ok, false);
  assert("error" in response);
});


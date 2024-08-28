import { fetchJSON, getMediaType } from "../src/fetch.ts";
import { assert, assertEquals } from "@std/assert";
import { mockFetch, resetFetch } from "@c4spar/mock-fetch";

Deno.test("fetchJSON - Returns successful response", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({ message: "Success" }),
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json" },
  });

  const request = new Request("https://apitest.vipps.no/api");

  const result = await fetchJSON(request);
  assertEquals(result, { ok: true, data: { message: "Success" } });
  resetFetch();
});

Deno.test("fetchJSON - Returns parseError on Bad Request", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({ error: "Bad Request" }),
    status: 400,
    statusText: "Bad Request",
  });

  const request = new Request("https://apitest.vipps.no/api");
  const result = await fetchJSON(request);
  assertEquals(result.ok, false);
  resetFetch();
});

Deno.test("fetchJSON - Returns parseError on Forbidden", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({ error: "Forbidden" }),
    status: 403,
    statusText: "Forbidden",
  });

  const request = new Request("https://apitest.vipps.no/api");
  const result = await fetchJSON(request);
  assertEquals(result.ok, false);
  resetFetch();
});

Deno.test("fetchJSON - Returns parseError on Internal Server Error", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({ error: "Internal Server Error" }),
    status: 500,
    statusText: "Internal Server Error",
  });

  const request = new Request("https://apitest.vipps.no/api");

  try {
    await fetchJSON(request);
  } catch (error) {
    assert(error instanceof Error);
  }

  resetFetch();
});

Deno.test("fetchJSON - Catch JSON", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({}),
    status: 200,
    headers: { "content-type": "application/json" },
  });

  const request = new Request("https://apitest.vipps.no/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  resetFetch();
});

Deno.test("fetchJSON - Catch text/plain", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    body: JSON.stringify({}),
    status: 200,
    headers: { "content-type": "text/plain" },
  });

  const request = new Request("https://apitest.vipps.no/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  resetFetch();
});

Deno.test("fetchJSON - Catch Empty Response", async () => {
  mockFetch("https://apitest.vipps.no/api", {
    status: 204,
  });

  const request = new Request("https://apitest.vipps.no/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  resetFetch();
});

Deno.test("getMediaType - should return undefined if content-type header is missing", () => {
  const response = new Response();
  const result = getMediaType(response);
  assert(result === undefined);
});

Deno.test("getMediaType - should return undefined if media type cannot be parsed", () => {
  const response = new Response(undefined, { headers: { "content-type": "" } });
  const result = getMediaType(response);
  assert(result === undefined);
});

Deno.test("getMediaType should return the parsed media type", () => {
  const response = new Response(undefined, {
    headers: { "content-type": "application/json" },
  });
  const result = getMediaType(response);
  assertEquals(result, "application/json");
});

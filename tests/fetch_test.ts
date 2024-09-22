import { fetchJSON } from "../src/fetch.ts";
import { assert, assertEquals } from "@std/assert";
import * as mf from "@hongminhee/deno-mock-fetch";

Deno.test("fetchJSON - Returns successful response", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
    });
  });

  const request = new Request("https://example.com/api");

  const result = await fetchJSON(request);
  assertEquals(result, { ok: true, data: { message: "Success" } });
  mf.reset();
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
  const result = await fetchJSON(request);
  assertEquals(result.ok, false);
  mf.reset();
});

Deno.test("fetchJSON - Returns parseError on Forbidden", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      statusText: "Forbidden",
    });
  });

  const request = new Request("https://example.com/api");
  const result = await fetchJSON(request);
  assertEquals(result.ok, false);
  mf.reset();
});

Deno.test("fetchJSON - Returns parseError on Internal Server Error", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  const request = new Request("https://example.com/api");

  try {
    await fetchJSON(request);
  } catch (error) {
    assert(error instanceof Error);
  }

  mf.reset();
});

Deno.test("fetchJSON - Catch JSON", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });

  const request = new Request("https://example.com/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  mf.reset();
});

Deno.test("fetchJSON - Catch text/plain", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  });

  const request = new Request("https://example.com/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  mf.reset();
});

Deno.test("fetchJSON - Catch Empty Response", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(undefined, {
      status: 204,
    });
  });

  const request = new Request("https://example.com/api");
  const result = await fetchJSON(request);

  assertEquals(result.ok, true);
  mf.reset();
});
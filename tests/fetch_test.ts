import { fetchJSON } from "../src/fetch.ts";
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
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;
  assertEquals(result.ok, false);
  assert(result.message !== undefined);
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
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;
  assertEquals(result.ok, false);
  assert(result.message !== undefined);
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
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;

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
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;

  assertEquals(result.ok, true);
  assertEquals(result.data, {});
  mf.reset();
});

Deno.test("fetchJSON - Catch Problem JSON", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/api", () => {
    return new Response(
      JSON.stringify({ type: "https://example.com/error" }),
      { headers: { "content-type": "application/problem+json" } },
    );
  });

  const request = new Request("https://example.com/api");
  // deno-lint-ignore no-explicit-any
  const result = await fetchJSON(request) as any;

  assertEquals(result.ok, false);
  mf.reset();
});

Deno.test("fetchJSON - Catch Problem JSON - Case insensitive", async () => {
  mf.install(); // mock out calls to `fetch`

  mf.mock("GET@/foo", () => {
    return new Response(
      JSON.stringify({ type: "https://example.com/error" }),
      { headers: { "Content-type": "application/problem+json" } },
    );
  });

  mf.mock("GET@/bar", () => {
    return new Response(
      JSON.stringify({ type: "https://example.com/error" }),
      { headers: { "Content-Type": "application/problem+json" } },
    );
  });

  const requestFoo = new Request("https://example.com/foo");
  // deno-lint-ignore no-explicit-any
  const resultFoo = await fetchJSON(requestFoo) as any;

  assertEquals(resultFoo.ok, false);

  const requestBar = new Request("https://example.com/bar");
  // deno-lint-ignore no-explicit-any
  const resultBar = await fetchJSON(requestBar) as any;

  assertEquals(resultBar.ok, false);
  mf.reset();
});

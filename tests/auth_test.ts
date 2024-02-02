import { assertEquals, mf } from "./test_deps.ts";
import { Client } from "../src/mod.ts";

Deno.test("getToken - Should have correct url and header", async () => {
  mf.install(); // mock out calls to `fetch`

  const client = Client({ merchantSerialNumber: "", subscriptionKey: "" });

  mf.mock("POST@/accesstoken/get", (req: Request) => {
    assertEquals(req.url, "https://api.vipps.no/accesstoken/get");
    assertEquals(req.headers.has("client_id"), true);
    return new Response(JSON.stringify({}), {
      status: 200,
    });
  });

  const token = await client.auth.getToken("fake", "fake");

  assertEquals(token.ok, true);

  mf.reset();
});

Deno.test("getToken - Invalid credentials", async () => {
  mf.install(); // mock out calls to `fetch`

  const client = Client({ merchantSerialNumber: "", subscriptionKey: "" });

  mf.mock("POST@/accesstoken/get", () => {
    return new Response(JSON.stringify({ ok: false, error: "Bad Request" }), {
      status: 400,
    });
  });

  const token = await client.auth.getToken("fake", "fake");

  assertEquals(token.ok, false);

  mf.reset();
});

Deno.test("Auth - getToken - Unauthorized subscription key", async () => {
  mf.install(); // mock out calls to `fetch`

  const client = Client({ merchantSerialNumber: "", subscriptionKey: "" });

  mf.mock("POST@/accesstoken/get", () => {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
    });
  });

  const token = await client.auth.getToken("fake", "fake");

  assertEquals(token.ok, false);

  mf.reset();
});

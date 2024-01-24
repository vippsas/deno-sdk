import { createApi } from "../src/api_proxy.ts";
import { baseClient } from "../src/base_client.ts";
import { assert, assertEquals } from "./test_deps.ts";
import { RequestData } from "../src/types.ts";

Deno.test("createApi - Should return a Proxy object with method", () => {
  const client = baseClient({ merchantSerialNumber: "", subscriptionKey: "" });

  const factory = {
    foo(): RequestData<unknown, unknown> {
      return {
        method: "GET",
        url: "/foo",
      };
    },
  };

  const api = createApi(client, factory);
  assertEquals(typeof api, "object");
  assertEquals(typeof api.foo, "function");
});

Deno.test("createApi - Should return an error if method is not in factory", async () => {
  const client = baseClient({ merchantSerialNumber: "", subscriptionKey: "" });

  const factory = {
    foo(): RequestData<unknown, unknown> {
      return {
        method: "GET",
        url: "/foo",
      };
    },
  };

  const api = createApi(client, factory) as unknown as { bar(): Promise<void> };

  try {
    await api.bar();
  } catch (e) {
    assert(e instanceof Error);
    assert(e.message === "Method bar does not exist in the factory.");
  }
});

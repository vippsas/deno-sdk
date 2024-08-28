import { proxifyFactory } from "../src/api_proxy.ts";
import { baseClient } from "../src/base_client.ts";
import { assertEquals } from "@std/assert";
import { RequestData } from "../src/types.ts";

Deno.test("proxifyFactory - Should return a Proxy object with method", () => {
  const client = baseClient({ merchantSerialNumber: "", subscriptionKey: "" });

  const factory = {
    foo(): RequestData<unknown, unknown> {
      return {
        method: "GET",
        url: "/foo",
      };
    },
  };

  const api = proxifyFactory(client, factory);
  assertEquals(typeof api, "object");
  assertEquals(typeof api.foo, "function");
});

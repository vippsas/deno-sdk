import { assertEquals } from "./test_deps.ts"
import { authRequestFactory } from "../src/apis/auth.ts";

Deno.test("getToken - Should have correct url and header", () => {
  const actual = authRequestFactory.getToken("fake", "fake") as unknown;

  const expected = {
    method: "POST",
    url: "/accesstoken/get",
    additionalHeaders: {
      client_id: "fake",
      client_secret: "fake",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  assertEquals(actual, expected);
});

import { loginRequestFactory } from "../src/apis/login.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("login - discovery - should return the correct RequestData object", () => {
  const requestData = loginRequestFactory.discovery();

  assertEquals(
    requestData.url,
    "/access-management-1.0/access/.well-known/openid-configuration",
  );
  assertEquals(requestData.method, "GET");
  assertEquals(requestData.omitHeaders, ["Ocp-Apim-Subscription-Key"]);
});

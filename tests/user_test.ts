import { userRequestFactory } from "../src/apis/user.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("userRequestFactory.info should return the correct RequestData object", () => {
  const token = "your-token";
  const sub = "your-sub";

  const expectedRequestData = {
    url: "/vipps-userinfo-api/userinfo/your-sub",
    method: "GET",
    token: "your-token"
  };

  const requestData = userRequestFactory.info(token, sub);

  assertEquals(requestData.url, expectedRequestData.url);
  assertEquals(requestData.method, expectedRequestData.method);
  assertEquals(requestData.token, expectedRequestData.token);
});

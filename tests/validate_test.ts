import type { ClientConfig } from "../src/types_external.ts";
import type { RequestData } from "../src/types_internal.ts";
import { validateRequestData } from "../src/validate.ts";
import { assertEquals } from "@std/assert";

Deno.test("validateRequestData - Should return undefined for valid request data", () => {
  const requestData: RequestData<unknown, unknown> = {
    url: "/api/endpoint",
    method: "POST",
  };
  const cfg: ClientConfig = { merchantSerialNumber: "", subscriptionKey: "" };

  const result = validateRequestData(requestData, cfg);

  assertEquals(result, undefined);
});

Deno.test("validateRequestData - epayment - Should return error message when using forceApprove in Production", () => {
  const requestData: RequestData<unknown, unknown> = {
    url: "/epayment/approve",
    method: "POST",
  };
  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: false,
    retryRequests: false,
  };

  const result = validateRequestData(requestData, cfg);

  assertEquals(
    result,
    "forceApprove is only available in the test environment",
  );
});

Deno.test("validateRequestData - agreement - Should return error message when using forceAccept in Production ", () => {
  const requestData: RequestData<unknown, unknown> = {
    url: "/recurring/v3/agreements/foobar/accept",
    method: "POST",
  };

  const cfg: ClientConfig = {
    merchantSerialNumber: "",
    subscriptionKey: "",
    useTestMode: false,
    retryRequests: false,
  };

  const result = validateRequestData(requestData, cfg);

  assertEquals(result, "forceAccept is only available in the test environment");
});

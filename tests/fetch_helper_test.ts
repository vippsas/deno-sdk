import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseResponseToJson,
} from "../src/fetch_helper.ts";
import { assert, assertEquals } from "@std/assert";;

Deno.test("isServerErrorStatus should return true for server error status codes", () => {
  const serverErrorStatuses = [500, 501, 502, 503, 504, 505, 599];
  for (const status of serverErrorStatuses) {
    assert(isServerErrorStatus(status), `Expected true for status ${status}`);
  }
});

Deno.test("isServerErrorStatus should return false for non-server error status codes", () => {
  const nonServerErrorStatuses = [100, 200, 300, 400, 499, 600];
  for (const status of nonServerErrorStatuses) {
    assert(!isServerErrorStatus(status), `Expected false for status ${status}`);
  }
});

Deno.test("isSuccessfulStatus should return true for successful status codes", () => {
  const successfulStatuses = [200, 201, 202, 204, 299];
  for (const status of successfulStatuses) {
    assert(isSuccessfulStatus(status), `Expected true for status ${status}`);
  }
});

Deno.test("isSuccessfulStatus should return false for non-successful status codes", () => {
  const nonSuccessfulStatuses = [100, 199, 300, 400, 500];
  for (const status of nonSuccessfulStatuses) {
    assert(!isSuccessfulStatus(status), `Expected false for status ${status}`);
  }
});

Deno.test("parseResponseToJson - should parse valid JSON response", async () => {
  const jsonResponse = new Response(JSON.stringify({ key: "value" }), {
    headers: { "Content-Type": "application/json" },
  });

  const result = await parseResponseToJson(jsonResponse);
  assertEquals(
    result,
    { key: "value" },
    `Expected { key: 'value' }, but got ${result}`,
  );
});

Deno.test("parseResponseToJson - should parse invalid JSON response as text", async () => {
  const textResponse = new Response("This is not JSON", {
    headers: { "Content-Type": "text/plain" },
  });

  const result = await parseResponseToJson(textResponse);
  assertEquals(
    result,
    { text: "This is not JSON" },
    `Expected { text: 'This is not JSON' }, but got ${JSON.stringify(result)}`,
  );
});

Deno.test("parseResponseToJson - should handle empty response", async () => {
  const emptyResponse = new Response("", {
    headers: { "Content-Type": "text/plain" },
  });

  const result = await parseResponseToJson(emptyResponse);
  assertEquals(
    result,
    { text: "" },
    `Expected { text: '' }, but got ${result}`,
  );
});

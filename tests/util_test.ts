import { assertEquals } from "@std/assert";
import { generatePathParams } from "../src/apis/util.ts";

Deno.test("generatePathParams - with various parameters", () => {
  const params = {
    status: "active",
    createdAfter: 1627849200,
    pageNumber: 1,
    pageSize: 20,
    isActive: true,
  };
  const result = generatePathParams(params);
  const expected =
    "?status=active&createdAfter=1627849200&pageNumber=1&pageSize=20&isActive=true";
  assertEquals(result, expected);
});

Deno.test("generatePathParams - with empty parameters", () => {
  const params = {};
  const result = generatePathParams(params);
  const expected = "";
  assertEquals(result, expected);
});

Deno.test("generatePathParams - with undefined and null values", () => {
  const params = {
    status: "active",
    createdAfter: null,
    pageNumber: undefined,
    pageSize: 20,
  };
  const result = generatePathParams(params);
  const expected = "?status=active&pageSize=20";
  assertEquals(result, expected);
});

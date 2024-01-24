import { orderManagementRequestFactory } from "../src/apis/ordermanagement.ts";
import { assertEquals } from "./test_deps.ts";

Deno.test("addCategory - should return the correct RequestData object", () => {
  const body = {
    category: "GENERAL" as const,
    orderDetailsUrl: "https://www.example.com",
    imageId: "imageId",
  };
  const requestData = orderManagementRequestFactory.addCategory(
    "token",
    "orderId",
    "ecom",
    body,
  );

  assertEquals(requestData.url, `/order-management/v2/ecom/categories/orderId`);
  assertEquals(requestData.method, "PUT");
  assertEquals(requestData.body, body);
  assertEquals(requestData.token, "token");
});

Deno.test("addImage - should return the correct RequestData object", () => {
  const body = {
    imageId: "imageId",
    src: "src",
    type: "base64" as const,
  };
  const requestData = orderManagementRequestFactory.addImage("token", body);

  assertEquals(requestData.url, "/order-management/v1/images");
  assertEquals(requestData.method, "POST");
  assertEquals(requestData.body, body);
  assertEquals(requestData.token, "token");
});

Deno.test("addReceipt - should return the correct RequestData object", () => {
  const body = {
    bottomLine: {
      currency: "NOK" as const,
    },
    orderLines: [
      {
        id: "id",
        name: "name",
        taxPercentage: 0,
        totalAmount: 1000,
        totalAmountExcludingTax: 1000,
        totalTaxAmount: 0,
      },
    ],
  };
  const requestData = orderManagementRequestFactory.addReceipt(
    "token",
    "orderId",
    "ecom",
    body,
  );

  assertEquals(requestData.url, `/order-management/v2/ecom/receipts/orderId`);
  assertEquals(requestData.method, "POST");
  assertEquals(requestData.body, body);
  assertEquals(requestData.token, "token");
});

Deno.test("info - should return the correct RequestData object", () => {
  const requestData = orderManagementRequestFactory.info(
    "token",
    "orderId",
    "ecom",
  );

  assertEquals(requestData.url, `/order-management/v2/ecom/orderId`);
  assertEquals(requestData.method, "GET");
  assertEquals(requestData.token, "token");
});

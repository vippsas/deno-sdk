import { assertEquals } from "@std/assert";
import { Client } from "../src/mod.ts";

Deno.test("Client - available functions", () => {
  const client = Client({ merchantSerialNumber: "", subscriptionKey: "" });

  assertEquals(typeof client.auth.getToken, "function");
  assertEquals(typeof client.checkout.create, "function");
  assertEquals(typeof client.checkout.info, "function");
  assertEquals(typeof client.payment.create, "function");
  assertEquals(typeof client.payment.info, "function");
  assertEquals(typeof client.payment.cancel, "function");
  assertEquals(typeof client.payment.capture, "function");
  assertEquals(typeof client.payment.refund, "function");
  assertEquals(typeof client.payment.forceApprove, "function");
  assertEquals(typeof client.payment.history, "function");
  assertEquals(typeof client.recurring.agreement.create, "function")
  assertEquals(typeof client.recurring.agreement.forceAccept, "function")
  assertEquals(typeof client.recurring.agreement.info, "function")
  assertEquals(typeof client.recurring.agreement.list, "function")
  assertEquals(typeof client.recurring.agreement.update, "function")
  assertEquals(typeof client.recurring.charge.create, "function")
  assertEquals(typeof client.recurring.charge.cancel, "function")
  assertEquals(typeof client.recurring.charge.capture, "function")
  assertEquals(typeof client.recurring.charge.createMultiple, "function")
  assertEquals(typeof client.recurring.charge.info, "function")
  assertEquals(typeof client.recurring.charge.infoById, "function")
  assertEquals(typeof client.recurring.charge.list, "function")
  assertEquals(typeof client.recurring.charge.refund, "function")
  assertEquals(typeof client.webhook.list, "function");
  assertEquals(typeof client.webhook.register, "function");
  assertEquals(typeof client.webhook.delete, "function");
});

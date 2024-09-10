import { assertEquals } from "./test_deps.ts";
import { Client } from "../src/mod.ts";

Deno.test("Client - available functions", () => {
  const client = Client({ merchantSerialNumber: "", subscriptionKey: "" });

  assertEquals(typeof client.auth.getToken, "function");
  assertEquals(typeof client.payment.create, "function");
  assertEquals(typeof client.payment.info, "function");
  assertEquals(typeof client.payment.cancel, "function");
  assertEquals(typeof client.payment.capture, "function");
  assertEquals(typeof client.payment.refund, "function");
  assertEquals(typeof client.payment.forceApprove, "function");
  assertEquals(typeof client.payment.history, "function");
  assertEquals(typeof client.webhook.list, "function");
  assertEquals(typeof client.webhook.register, "function");
  assertEquals(typeof client.webhook.delete, "function");
});

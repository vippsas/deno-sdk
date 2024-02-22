import "https://deno.land/std@0.217.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@1.2.0/mod.ts";

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
const clientId = Deno.env.get("CLIENT_ID") || "";
const clientSecret = Deno.env.get("CLIENT_SECRET") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";

// Create a client
const client = Client({
  merchantSerialNumber,
  subscriptionKey,
  useTestMode: true,
  retryRequests: false,
});

// Grab a token
const accessToken = await client.auth.getToken(clientId, clientSecret);

// Check if the token was retrieved successfully
if (!accessToken.ok) {
  console.log("Error retrieving token", accessToken.error);
  Deno.exit(1);
}
const token = accessToken.data.access_token;

console.log("---------- Starting register webhooks ----------");
// Register a webhook
const registerHookResult = await client.webhook.register(token, {
  events: ["epayments.payment.created.v1", "user.checked-in.v1"],
  url: "https://example.com/hook/epayment",
});
console.log(registerHookResult);

console.log("---------- End of register webhooks ----------");
console.log("\n");
console.log("---------- Start of listing webhooks ----------");
const listHooksResult = await client.webhook.list(token);

// Print out a prettier list of currently registered webhooks
if (listHooksResult.ok) {
  listHooksResult.data.webhooks.forEach((hook) => {
    console.log(hook.id, hook.url, "Events:", hook.events.join(", "));
  });
}
console.log("---------- End of listing webhooks ----------");
console.log("\n");
console.log("---------- Start of deleting webhooks ----------");

// Delete the webhook created earlier, let all other webhooks remain
if (registerHookResult.ok) {
  const hookId = registerHookResult.data.id;
  const deleteResult = await client.webhook.delete(
    token,
    registerHookResult.data.id,
  );
  if (deleteResult.ok) {
    console.log("Deleted hook", hookId);
  } else {
    console.log("Error deleting hook", hookId, deleteResult.error);
  }
}
console.log("---------- End of deleting webhooks ----------");

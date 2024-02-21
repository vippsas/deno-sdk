import "https://deno.land/std@0.214.0/dotenv/load.ts";
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
  systemName: "My cool e-commerce system",
  systemVersion: "1.2.3",
  pluginVersion: "1.2.3",
  pluginName: "My cool plugin",
  useTestMode: true,
  retryRequests: false,
});

// Create a checkout session
const checkout = await client.checkout.create(clientId, clientSecret, {
  merchantInfo: {
    callbackUrl: "https://example.com/callbackUrl",
    returnUrl: "https://example.com/fallbackPage",
  },
  transaction: {
    amount: {
      currency: "NOK",
      value: 1000, // This value equals 10 NOK
    },
    paymentDescription: "One pair of socks.",
  },
});

// Check if the checkout session was created successfully
if (!checkout.ok) {
  console.error("😟 Error creating checkout session 😟");
  console.log(checkout.error);
  Deno.exit(1);
}

console.log("🎉 Checkout Session created successfully!");

const pollingUrl = checkout.data.pollingUrl;
console.log("🔗 URL to poll for session information:", pollingUrl);

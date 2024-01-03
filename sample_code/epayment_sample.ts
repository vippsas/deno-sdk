import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@0.5.2/mod.ts";

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
const clientId = Deno.env.get("CLIENT_ID") || "";
const clientSecret = Deno.env.get("CLIENT_SECRET") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";

const customerPhoneNumber = "TEST_PHONE"; // Update with your test phone number, including country code

// Create a client
const client = Client({
  merchantSerialNumber,
  subscriptionKey,
  useTestMode: true,
  retryRequests: false,
});

// Grab a token
const accessToken = await client.auth.getToken({
  clientId,
  clientSecret,
  subscriptionKey,
});

// Check if the token was retrieved successfully
if (!accessToken.ok) {
  console.error("😟 Error retrieving token 😟");
  console.error(accessToken.message);
  Deno.exit(1);
}

const token = accessToken.data.access_token;

// Create a payment
const payment = await client.payment.create(token, {
  amount: {
    currency: "NOK",
    value: 1000, // This value equals 10 NOK
  },
  paymentMethod: { type: "WALLET" },
  customer: { phoneNumber: customerPhoneNumber },
  returnUrl: `https://example.com/redirect`,
  userFlow: "WEB_REDIRECT",
  paymentDescription: "One pair of socks",
});

// Check if the payment was created successfully
if (!payment.ok) {
  console.error("😟 Error creating payment 😟");
  console.error(payment.error);
  Deno.exit(1);
}
console.log("🎉 Payment created successfully!");

const reference = payment.data.reference;
console.log("📋 Payment reference:", reference);

console.log(
  "Open the payment redirect URL in the browser and complete the payment:",
  payment.data.redirectUrl,
);

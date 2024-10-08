import { systemopen } from "@lambdalisue/systemopen";
import "@std/dotenv/load";
import { Client, CreatePaymentRequest } from "../src/mod.ts";

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
  console.error("😟 Error retrieving token 😟");
  console.error(accessToken.error);
  Deno.exit(1);
}

const token = accessToken.data.access_token;

// Create a payment
const request: CreatePaymentRequest = {
  amount: {
    currency: "NOK",
    value: 1000, // This value equals 10 NOK
  },
  paymentMethod: { type: "WALLET" },
  customer: { phoneNumber: "4712345678" },
  returnUrl: `https://yourwebsite.com/redirect`,
  userFlow: "WEB_REDIRECT",
  paymentDescription: "One pair of socks",
};
const payment = await client.payment.create(token, request);

// Check if the payment was created successfully
if (!payment.ok) {
  console.error("😟 Error creating payment 😟");
  console.error(payment.error);
  Deno.exit(1);
}
console.log("🎉 Payment created successfully!");

const reference = payment.data.reference;
console.log("📋 Payment reference:", reference);

// Open the payment redirect URL in the browser
if (payment.data.redirectUrl) {
  await systemopen(payment.data.redirectUrl);
} else {
  console.error("😟 Error: Redirect URL is undefined 😟");
}

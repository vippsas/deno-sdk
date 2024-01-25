import "https://deno.land/std@0.212.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@1.0.0/mod.ts";

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
const accessToken = await client.auth.getToken({
  clientId,
  clientSecret,
  subscriptionKey,
});

// Check if the token was retrieved successfully
if (!accessToken.ok) {
  console.error("😟 Error retrieving token 😟");
  console.error(accessToken.error);
  Deno.exit(1);
}

const token = accessToken.data.access_token;

// Create a payment with profile flow
const payment = await client.payment.create(token, {
  amount: {
    currency: "NOK",
    value: 1000, // This value equals 10 NOK
  },
  paymentMethod: { type: "WALLET" },
  customer: { phoneNumber: "4712345678" },
  returnUrl: `https://yourwebsite.com/redirect`,
  userFlow: "WEB_REDIRECT",
  paymentDescription: "One pair of socks",
  profile: { scope: "name phoneNumber address birthDate" },
});

// Check if the payment was created successfully
if (!payment.ok) {
  console.error("😟 Error creating payment 😟");
  console.error(payment.error);
  Deno.exit(1);
}
console.log("🎉 Payment created successfully!");

// Force approve the payment, for testing purposes.
// This requires the customer to have cards registered in Vipps MT
const approve = await client.payment.forceApprove(
  token,
  payment.data.reference,
  { customer: { phoneNumber: "4712345678" } },
);

// Check if the payment was approved successfully
if (!approve.ok) {
  console.error("😟 Error approving payment 😟");
  console.error(approve.error);
  Deno.exit(1);
}

// Retrive the payment
const paymentInfo = await client.payment.info(token, payment.data.reference);

// Check if the payment was retrieved successfully
if (!paymentInfo.ok) {
  console.error("😟 Error retriving payment 😟");
  console.error(paymentInfo.error);
  Deno.exit(1);
}

const sub = paymentInfo.data.profile.sub;

if (!sub) {
  console.error("😟 Error retriving sub 😟");
  Deno.exit(1);
}

// Retrive the user info
const userInfo = await client.user.info(token, sub);

// Check if the user info was retrieved successfully
if (!userInfo.ok) {
  console.error("😟 Error retriving user info 😟");
  console.error(userInfo.error);
  Deno.exit(1);
}

console.log("🎉 User info retrieved successfully!");
console.log(userInfo.data);

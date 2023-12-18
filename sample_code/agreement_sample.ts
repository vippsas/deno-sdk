import "https://deno.land/std@0.209.0/dotenv/load.ts";
import { Client } from "../src/mod.ts";

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
  console.error(accessToken.message);
  Deno.exit(1);
}

const token = accessToken.data.access_token;

const agreement = await client.agreement.create(token, {
  pricing: {
    type: "LEGACY",
    amount: 2500,
    currency: "NOK",
  },
  interval: {
    unit: "MONTH",
    count: 1,
  },
  merchantRedirectUrl: "https://example.com/redirect",
  merchantAgreementUrl: "https://example.com/agreement",
  phoneNumber: "4791234567",
  productName: "MyNews Digital",
});

console.log(agreement);

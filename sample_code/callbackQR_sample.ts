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
  console.error("😟 Error retrieving token 😟");
  console.error(accessToken.error);
  Deno.exit(1);
}

const token = accessToken.data.access_token;

const qrId = crypto.randomUUID();

const qr = await client.qr.callback.create(token, qrId, {
  locationDescription: "Kasse 1",
});

// Check if the QR was created successfully
if (!qr.ok) {
  console.error("😟 Error creating QR 😟");
  console.error(qr.error);
  Deno.exit(1);
}

const qrInfo = await client.qr.callback.info(token, qrId);

// Check if the QR was retrieved successfully
if (!qrInfo.ok) {
  console.error("😟 Error retrieving QR 😟");
  console.error(qrInfo.error);
  Deno.exit(1);
}

console.log(qrInfo.data.qrImageUrl);

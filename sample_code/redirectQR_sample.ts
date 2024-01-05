import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@0.5.2/mod.ts";

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

const qrId = crypto.randomUUID();

const qr = await client.redirectQR.create(token, "image/png", {
  id: qrId,
  redirectUrl: "https://example.com/myProduct",
  ttl: 600,
});

// Check if the QR was created successfully
if (!qr.ok) {
  console.error("😟 Error creating QR 😟");
  console.error(qr.message);
  Deno.exit(1);
}

const qrInfo = await client.redirectQR.info(token, qrId, "image/png");

// Check if the QR was retrieved successfully
if (!qrInfo.ok) {
  console.error("😟 Error retrieving QR 😟");
  console.error(qrInfo.message);
  Deno.exit(1);
}

console.log(qrInfo.data);

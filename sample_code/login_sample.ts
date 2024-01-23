import "https://deno.land/std@0.212.0/dotenv/load.ts";
import {
  Client,
  LoginAuthQueryParams,
} from "https://deno.land/x/vipps_mobilepay_sdk@0.7.0/mod.ts";
import { open } from "https://deno.land/x/open@v0.0.6/index.ts";

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
const clientId = Deno.env.get("CLIENT_ID") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";

// Create a client
const client = Client({
  merchantSerialNumber,
  subscriptionKey,
  useTestMode: true,
  retryRequests: false,
});

// Discover configuation information
console.log("🔎 Discovering configuration 🔎");
const config = await client.login.discovery();

if (!config.ok) {
  console.error("😟 Error discovering configuration 😟");
  console.error(config.error);
  Deno.exit(1);
}

console.log("✅ Configuration discovered ✅");
console.log(config.data);

console.log(config.data.authorization_endpoint);

const queryParameters: LoginAuthQueryParams = {
  client_id: clientId,
  redirect_uri: "http://localhost",
  scope: "openid name phoneNumber address birthDate",
  response_type: "code",
  state: crypto.randomUUID(),
};
const searchParams = Object.entries(queryParameters).map(([key, value]) =>
  `${key}=${encodeURIComponent(value)}`
).join("&");

const redirectUrl = `${config.data.authorization_endpoint}?${searchParams}`;

// Serve a page that will redirect to the authorization endpoint
await open(redirectUrl);

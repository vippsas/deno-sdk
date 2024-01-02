import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { Client } from "../src/mod.ts";

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
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
  console.error(config.message);
  Deno.exit(1);
}

console.log(config.data);

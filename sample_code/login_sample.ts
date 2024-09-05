import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { Client } from "..//src/mod.ts";

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
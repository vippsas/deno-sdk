import "https://deno.land/std@0.214.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@1.2.0/mod.ts";

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
const clientId = Deno.env.get("CLIENT_ID") || "";
const clientSecret = Deno.env.get("CLIENT_SECRET") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";

const customerPhoneNumber = "4791234567";

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

const agreement = await client.recurring.agreement.create(token, {
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
  phoneNumber: customerPhoneNumber,
  productName: "MyNews Digital",
});

// Check if the agreement was created successfully
if (!agreement.ok) {
  console.error("😟 Error creating agreement 😟");
  console.error(agreement.error);
  Deno.exit(1);
}

const agreementId = agreement.data.agreementId;

const acceptedAgreement = await client.recurring.agreement.forceAccept(
  token,
  agreementId,
  { phoneNumber: customerPhoneNumber },
);

// Check if the agreement was accepted successfully
if (!acceptedAgreement.ok) {
  console.error("😟 Error accepting agreement 😟");
  console.error(acceptedAgreement.error);
  Deno.exit(1);
}

// 10 days from now in YYYY-MM-DD format
const tenDaysFromToday = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  .toISOString().split("T")[0];

const charge = await client.recurring.charge.create(token, agreementId, {
  amount: 2500,
  description: "MyNews Digital",
  orderId: crypto.randomUUID(),
  due: tenDaysFromToday,
  retryDays: 5,
  transactionType: "DIRECT_CAPTURE",
  type: "RECURRING"
});

// Check if the charge was created successfully
if (!charge.ok) {
  console.error("😟 Error creating charge 😟");
  console.error(charge.error);
  Deno.exit(1);
}

const chargeId = charge.data.chargeId;

const chargeInfo = await client.recurring.charge.info(
  token,
  agreementId,
  chargeId,
);

// Check if the charge info was fetched successfully
if (!chargeInfo.ok) {
  console.error("😟 Error retrieving charge 😟");
  console.error(chargeInfo.error);
  Deno.exit(1);
}

console.log(chargeInfo.data);

import "https://deno.land/std@0.214.0/dotenv/load.ts";
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@1.0.0/mod.ts";

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

const agreementInfo = await client.recurring.agreement.info(
  token,
  agreement.data.agreementId,
);

// Check if the agreement was retrieved successfully
if (!agreementInfo.ok) {
  console.error("😟 Error retreiving agreement 😟");
  console.error(agreementInfo.error);
  Deno.exit(1);
}

const activatedAgreement = await client.recurring.agreement.forceAccept(
  token,
  agreement.data.agreementId,
  {
    phoneNumber: customerPhoneNumber,
  },
);

// Check if the agreement was retrieved successfully
if (!activatedAgreement.ok) {
  console.error("😟 Error force accepting the agreement 😟");
  console.error(activatedAgreement.error);
  Deno.exit(1);
}

const updatedAgreement = await client.recurring.agreement.update(
  token,
  agreement.data.agreementId,
  { status: "STOPPED" },
);

// Check if the agreement was retrieved successfully
if (!updatedAgreement.ok) {
  console.error("😟 Error updating agreement 😟");
  console.error(updatedAgreement.error);
  Deno.exit(1);
}

const listAgreements = await client.recurring.agreement.list(
  token,
  "STOPPED",
  1,
);

// Check if the agreements was retrieved successfully
if (!listAgreements.ok) {
  console.error("😟 Error retreiving agreements 😟");
  console.error(listAgreements.error);
  Deno.exit(1);
}

console.log(listAgreements.data);

import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import "https://deno.land/std@0.212.0/dotenv/load.ts";
//import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@0.8.0/mod.ts";
import { Client } from "../src/mod.ts"; // TODO Revert to deno.land/x once a tag is released

// First, get your API keys from https://portal.vipps.no/
// Here we assume they are stored in a .env file, see .env.example
const clientId = Deno.env.get("CLIENT_ID") || "";
const clientSecret = Deno.env.get("CLIENT_SECRET") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";

console.log(subscriptionKey);
// Create a client
const client = Client({
  merchantSerialNumber,
  subscriptionKey,
  useTestMode: false,
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

// Creating an ePayment order to put a receipt on
const payment = await client.payment.create(token, {
  amount: {
    currency: "NOK",
    value: 100,
  },
  paymentMethod: {
    type: "WALLET",
  },
  userFlow: "WEB_REDIRECT",
  returnUrl: "https://example.com/",
  paymentDescription: "This is my BOOMstick!",
});

// Check if the payment was created successfully
if (!payment.ok) {
  console.error("😟 Error creating payment 😟");
  console.error(payment.error);
  Deno.exit(1);
}
console.log("🎉 Payment created successfully!");

console.log("We have a payment, let's open the browser...");
await open(payment.data.redirectUrl);

// Ask the user to complete the payment
const shouldProceed = confirm(
  "Complete the order, then press 'y' and hit enter.",
);

// Check if the user wants to proceed
if (shouldProceed === false) {
  console.log("Ok, exiting.");
  Deno.exit(1);
}

console.log("Aaaaaand we continue to the fun part!");
const orderReference = payment.data.reference;

// Add a receipt to the order
const receipt = await client.order.addReceipt(
  token,
  orderReference,
  "ecom",
  {
    orderLines: [
      {
        name: "BOOMstick #1",
        id: "sku-1",
        totalAmount: 100,
        totalAmountExcludingTax: 80,
        totalTaxAmount: 20,
        taxPercentage: 25,
      },
    ],
    bottomLine: {
      currency: "NOK",
    },
  },
);

// Check if the receipt was added successfully
if (receipt.ok) {
  console.log("Receipt: ", receipt);
} else {
  console.log("Error adding receipt", receipt.error);
}

// Retrieve the order
const order = await client.order.info(token, orderReference, "ecom");

// Check if the order was retrieved successfully
if (!order.ok) {
  console.error("😟 Error retrieving order 😟");
  console.error(order.error);
  Deno.exit(1);
}

// Add a category to the order
const addCategoryToOrder = await client.order.addCategory(
  token,
  orderReference,
  "ecom",
  {
    category: "RECEIPT",
    imageId: null,
    orderDetailsUrl: `https://example.com/portal/receipt/${orderReference}`,
  },
);

// Check if the category was added successfully
if (!addCategoryToOrder.ok) {
  console.error("😟 Error adding category to order 😟");
  console.error(addCategoryToOrder.error);
  Deno.exit(1);
}

console.log("🎉 Successfully added category to order 🎉 ");
console.log(addCategoryToOrder.data);

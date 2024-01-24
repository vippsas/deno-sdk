import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import "https://deno.land/std@0.208.0/dotenv/load.ts";
//import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@0.8.0/mod.ts";
import { Client } from "../src/mod.ts"; // TODO Revert to deno.land/x on commit

// Read environment variables
const clientId = Deno.env.get("CLIENT_ID") || "";
const clientSecret = Deno.env.get("CLIENT_SECRET") || "";

const merchantSerialNumber = Deno.env.get("MERCHANT_SERIAL_NUMBER") || "";
const subscriptionKey = Deno.env.get("SUBSCRIPTION_KEY") || "";
console.log(clientId)
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

if (!accessToken.ok) {
  console.log("Error retrieving token", accessToken.error);
  Deno.exit(1);
}
const token = accessToken.data.access_token;

// Creating an ePayment order to put a receipt on
const orderReference = crypto.randomUUID();
const payment = await client.payment.create(token, {
  reference: orderReference,
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
if (!payment.ok) {
  console.log("Error creating payment", payment.error);
  Deno.exit(1);
}
console.log("We have a payment, let's open the browser...");
await open(payment.data.redirectUrl);

const shouldProceed = confirm("Complete the order, then press 'y' and hit enter.");
console.log("Aaaaaand we continue to the fun part!");
const receipt = await client.orderManagement.addReceipt(
  token,
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
  "ecom",
  orderReference,
);
if (receipt.ok) {
  console.log("Receipt: ", receipt);
} else {
  console.log("Error adding receipt", receipt.error);
}

const fetchedReceipt = await client.orderManagement.getOrderWithCategoryAndReceipt(token, "ecom", orderReference);
console.log(fetchedReceipt);
// const addCategoryToOrderResult = await client.orderManagement
//   .addCategoryToOrder(token, "ecom", orderReference, {
//     category: "RECEIPT",
//     imageId: null,
//     orderDetailsUrl: `https://example.com/portal/receipt/${orderReference}`,
//   });

// if (addCategoryToOrderResult.ok) {
//   console.log("Successfully added category to order");
//   console.log("Data:", addCategoryToOrderResult.data);
// } else {
//   console.log(
//     "Error adding category to order:",
//     addCategoryToOrderResult.error,
//   );
// }



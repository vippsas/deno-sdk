# Vipps Mobilepay SDK

SDK client for Vipps Mobilepay public APIs.

A zero dependency, zero configuration ES Module built with Deno. The code is written entirely in TypeScript and has 100% test coverage.

Available on: [deno.land](https://deno.land/x/vipps_mobilepay_sdk) and [NPM](https://www.npmjs.com/package/@vippsmobilepay/sdk)

```ts
import { Client } from "https://deno.land/x/vipps_mobilepay_sdk@1.0.0/mod.ts";

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

// Create a payment
const payment = await client.payment.create(token, {
  amount: {
    currency: "NOK",
    value: 1000, // This value equals 10 NOK
  },
  paymentMethod: { type: "WALLET" },
  customer: { phoneNumber: "4712345678" },
  returnUrl: `https://yourwebsite.com/redirect`,
  userFlow: "WEB_REDIRECT",
  paymentDescription: "One pair of socks",
});
```

## General documentation and code samples

Documentation of the SDK, and about Vipps MobilePay in general, please visit our [developer docs](https://developer.vippsmobilepay.com/docs/SDKs/).

A wide range of code samples are available in `sample_code/`.

## Importing types from the SDK

All external exports are defined in `src/mod.ts`. Any exports not included in this file are deemed
internal and any modifications will not be treated as breaking changes. As such,
internal exports should be treated as unstable and used at your own risk.

## Working on the code base

You need a recent version of `deno` before getting started.

### Running tests

If you make changes to this repo, or just want to make sure things are working
as desired, you can run:

    deno test

To get a full test coverage report in a nice HTML format, run:

    deno test --coverage && deno coverage ./coverage --html

### Packaging

New tags are immediately available on [deno.land](https://deno.land/x/vipps_mobilepay_sdk) (using a webhook in the repo settings).

To package for NPM, run:

    deno run -A scripts/publish_latest_tag_to_npm.ts

## Getting help

We welcome contributions from everyone! Please submit your PR, report your issue, or simply raise a question directly here in Github to get in touch, we'd love to hear from you. To get in contact with our support team, or for other inquiries, please visit our [Contact page](https://developer.vippsmobilepay.com/docs/contact/)
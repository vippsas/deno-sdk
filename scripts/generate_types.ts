import { createClient } from "@hey-api/openapi-ts";
import { run } from "./run.ts";

// Access Token API
await createClient({
  input:
    "https://developer.vippsmobilepay.com/redocusaurus/access-token-swagger-id.yaml",
  output: "src/generated_types/access_token",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/generated_types/access_token/index.ts`);

// Checkout API
await createClient({
  input:
    "https://developer.vippsmobilepay.com/redocusaurus/checkout-swagger-id.yaml",
  output: "src/generated_types/checkout",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/generated_types/checkout/index.ts`);

// ePayment API
await createClient({
  input: "https://developer.vippsmobilepay.com/redocusaurus/epayment-swagger-id.yaml",
  output: "src/generated_types/epayment",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/generated_types/epayment/index.ts`);

// Recurring API
await createClient({
  input: "https://developer.vippsmobilepay.com/redocusaurus/recurring-swagger-id.yaml",
  output: "src/generated_types/recurring",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/generated_types/recurring/index.ts`);

// Webhooks API
await createClient({
  input: "https://developer.vippsmobilepay.com/redocusaurus/webhooks-swagger-id.yaml",
  output: "src/generated_types/webhooks",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/generated_types/webhooks/index.ts`);

// Auto-format the code
await run(`deno fmt --quiet`, "Auto-formatting the code...");

import { createClient } from "npm:@hey-api/openapi-ts";
import { run } from "./run.ts";

// ePayment API
await createClient({
  input:
    "https://developer.vippsmobilepay.com/redocusaurus/epayment-swagger-id.yaml",
  output: "src/apis/generated_types/epayment",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/apis/generated_types/epayment/index.ts`);

// Webhooks API
await createClient({
  input:
    "https://developer.vippsmobilepay.com/redocusaurus/webhooks-swagger-id.yaml",
  output: "src/apis/generated_types/webhooks",
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/apis/generated_types/webhooks/index.ts`);

import { createClient } from 'npm:@hey-api/openapi-ts';
import { run } from "./run.ts";

// Login API
await createClient({
  input: 'https://developer.vippsmobilepay.com/redocusaurus/login-swagger-id.yaml',
  output: 'src/apis/generated_types/login-api',
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/apis/generated_types/login-api/index.ts`);

// User API
await createClient({
  input: 'https://developer.vippsmobilepay.com/redocusaurus/userinfo-swagger-id.yaml',
  output: 'src/apis/generated_types/user-api',
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/apis/generated_types/user-api/index.ts`);

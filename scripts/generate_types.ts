//deno run -A npm:@hey-api/openapi-ts -i scripts/swagger.yaml -o schema/client -c false --services false --schemas false --exportCore false  

//npx swagger-typescript-api -p ./swagger.json -o ./src -n myApi.ts

import { createClient } from 'npm:@hey-api/openapi-ts';
import { gray } from "jsr:@std/fmt/colors";
import { run } from "./run.ts";

console.log(gray(`Generating Login API types...`));

await createClient({
  input: 'https://developer.vippsmobilepay.com/redocusaurus/login-swagger-id.yaml',
  output: 'src/apis/generated_types/login-api',
  services: false,
  exportCore: false,
  schemas: false,
});

await run(`rm -rf src/apis/generated_types/login-api/index.ts`, `Removing index.ts...`, true);

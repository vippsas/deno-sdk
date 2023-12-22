import { build, emptyDir } from "./script_deps.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  test: false,
  shims: {
    deno: false,
  },
  package: {
    // package.json properties
    name: "vipps_mobilepay_sdk",
    version: Deno.args[0],
    description: "Official SDK for Vipps MobilePay APIs",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/vippsas/deno-sdk.git",
    },
    bugs: {
      url: "https://github.com/vippsas/deno-sdk/issues",
    },
    homepage: "https://developer.vippsmobilepay.com/docs/SDKs/",
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE.md", "npm/LICENSE.md");
    Deno.copyFileSync("./src/README.md", "npm/README.md");
  },
});

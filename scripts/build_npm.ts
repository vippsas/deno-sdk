import { build, emptyDir } from "./script_deps.ts";

/**
 * This script builds the SDK for NPM.
 *
 * It is run from the root of the repository with:
 * 'Deno run -A scripts/build_npm.ts 1.0.0'
 *
 * '1.0.0' is the version, or git tag, you wish to use.
 *
 * after running the script, the SDK can be published to NPM with:
 * 'cd npm && npm publish --access public'
 *
 * @example Deno run -A scripts/build_npm.ts 1.0.0 && cd npm && npm publish --access public
 */

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
    name: "@vippsmobilepay/sdk",
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

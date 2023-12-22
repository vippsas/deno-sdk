import { build, emptyDir } from "./script_deps.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
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
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("./src/README.md", "npm/README.md");
  },
});
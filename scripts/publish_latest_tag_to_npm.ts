import { colors, gt, parse, Spinner } from "./script_deps.ts";
import { run } from "./run.ts";

const PACKAGE_NAME = `@vippsmobilepay/sdk`;

const spinnerTags = new Spinner({ message: `Fetching latest tags...` });
spinnerTags.start();
await run(`git fetch --tags`);
spinnerTags.stop();

// Finding latest tagged commit across branches
const latestTaggedCommit = await run(`git rev-list --tags --max-count=1`);
const trimmedCommit = latestTaggedCommit.trim();
console.log(colors.gray(`Latest tag found ${trimmedCommit}`));

// Finding latest tag name
const latestTagName = await run(`git describe --tags ${trimmedCommit}`);
const trimmedTag = latestTagName.trim();
console.log(colors.gray(`Latest tag name: ${trimmedTag}`));

const spinnerNpm = new Spinner({
  message: `Fetching latest published npm version...`,
});
spinnerNpm.start();
const latestNpmVersion = await run(`npm show ${PACKAGE_NAME} version`);
spinnerNpm.stop();
console.log(colors.gray(`Latest npm version: ${latestNpmVersion}`));

try {
  const latestSemVer = parse(trimmedTag);
  const latestNpmSemVer = parse(latestNpmVersion);
  const tagIsGreaterThanNpm = gt(latestSemVer, latestNpmSemVer);
  if (!tagIsGreaterThanNpm) {
    console.log(
      colors.white(
        `📀 Latest tag version ${trimmedTag}. 📮 Latest npm version ${latestNpmVersion}`,
      ),
    );
    console.log(colors.white(`No need to publish. Bye! 👋`));
    Deno.exit(0);
  }
} catch (error) {
  console.log(`Could not parse tag and npm values 💥`);
  console.error(error);
  Deno.exit(1);
}
const build = prompt(
  colors.green(
    colors.bold(`Do you want to build ${trimmedTag} for npm? (y/n)`),
  ),
);
if (build?.toLowerCase().trim() !== "y") {
  console.log(colors.white(`No problemo. Bye! 👋`));
  Deno.exit(0);
}

const spinnerBuild = new Spinner({ message: `Building...` });
spinnerBuild.start();
const buildOutput = await run(
  `${Deno.execPath()} run -A scripts/build_npm.ts ${trimmedTag}`,
);
spinnerBuild.stop();
console.log(buildOutput);

const publish = prompt(
  colors.green(
    colors.bold(`Do you want to publish ${trimmedTag} to npm? (y/n)`),
  ),
);
if (publish?.toLowerCase().trim() !== "y") {
  console.log(`No problemo. Bye! 👋`);
  Deno.exit(0);
}

const spinnerPublish = new Spinner({ message: `Publishing...` });
spinnerPublish.start();
// Igonre npm errors since we are checking for them later
await run(`npm publish ./npm --access public`, true);
spinnerPublish.stop();

const spinnerNewNpm = new Spinner({
  message: `Checking new published npm package...`,
});
spinnerNewNpm.start();
const newNpmVersion = await run(`npm show ${PACKAGE_NAME} version`);
spinnerNewNpm.stop();

if (newNpmVersion.trim() !== trimmedTag) {
  console.log(
    colors.red(`💥 Published version ${newNpmVersion} != ${trimmedTag}`),
  );
  console.log(colors.red(`💥 Something went wrong. Please check npm logs.`));
  Deno.exit(1);
}

console.log(colors.white(`🚀 Published package! 🚀`));
console.log(
  colors.white(
    `🔗 https://www.npmjs.com/package/${PACKAGE_NAME}/v/${trimmedTag}`,
  ),
);

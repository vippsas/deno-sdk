import { bold, gray, green, white } from "jsr:@std/fmt/colors";
import { greaterThan, parse } from "jsr:@std/semver";
import { run } from "./run.ts";

const PACKAGE_NAME = `@vippsmobilepay/sdk`;

await run(`git fetch --tags`, `Fetching latest tags...`, true);

// Finding latest tagged commit across branches
const latestTaggedCommit = await run(`git rev-list --tags --max-count=1`);
const trimmedCommit = latestTaggedCommit.trim();
console.log(gray(`Latest tag found ${trimmedCommit}`));

// Finding latest tag name
const latestTagName = await run(`git describe --tags ${trimmedCommit}`);
const trimmedTag = latestTagName.trim();
console.log(gray(`Latest tag name: ${trimmedTag}`));

const latestNpmVersion = await run(
  `npm view ${PACKAGE_NAME} version`,
  `Fetching latest published npm version...`,
);
console.log(gray(`Latest npm version: ${latestNpmVersion}`));

try {
  const latestSemVer = parse(trimmedTag);
  const latestNpmSemVer = parse(latestNpmVersion);
  const tagIsGreaterThanNpm = greaterThan(latestSemVer, latestNpmSemVer);
  if (!tagIsGreaterThanNpm) {
    console.log(
      white(
        `📀 Latest tag version ${trimmedTag}. 📮 Latest npm version ${latestNpmVersion}`,
      ),
    );
    console.log(white(`No need to publish. Bye! 👋`));
    Deno.exit(0);
  }
} catch (error) {
  console.log(`Could not parse tag and npm values 💥`);
  console.error(error);
  Deno.exit(1);
}
const build = prompt(
  green(bold(`Do you want to build ${trimmedTag} for npm? (y/n)`)),
);
if (build?.toLowerCase().trim() !== "y") {
  console.log(white(`No problemo. Bye! 👋`));
  Deno.exit(0);
}

const buildOutput = await run(
  `${Deno.execPath()} run -A scripts/build_npm.ts ${trimmedTag}`,
  `Building...`,
);
console.log(buildOutput);
console.log(" ");

// Ask the user to publish, this is a manual step for now
console.log(white(`🚀 Ready to publish, run; 🚀`));
console.log(white(`npm publish ./npm --access public`));

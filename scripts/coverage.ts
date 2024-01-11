/**
 * Calculates and checks the branch coverage of a Deno project.
 *
 * @remarks
 * This script runs the tests with coverage enabled and then analyzes the coverage results.
 * If the branch coverage is below a specified threshold, it exits with an error.
 *
 * @param THRESHOLD - The minimum branch coverage threshold (in percentage) required for the project.
 */

import { run } from "./run.ts";

// Minimum branch coverage threshold (in percentage)
const THRESHOLD = 90;

// Run tests with coverage enabled
await run(`deno test --coverage`);

// Calculate branch coverage
const coverageReport = await run(`deno coverage ./coverage`);

// Remove ANSI escape codes
const words = coverageReport.replaceAll("\x1b", " ").split(" ");

// Remove all non-numbers
const floats = words.filter((word) => !isNaN(parseFloat(word)));

// Pick the second last number
const branchTotal = parseFloat(floats.at(-2) || "");

if (!branchTotal) {
  console.error("Could not retrieve branch coverage");
  Deno.exit(1);
}

if (branchTotal === 100) {
  console.log("Branch coverage is perfect! 🥹");
} else if (branchTotal > THRESHOLD) {
  console.log(`Branch coverage is good: ${branchTotal}% ✅`);
} else {
  console.log(`Branch coverage is bad: ${branchTotal}% 💀`);
  Deno.exit(1);
}

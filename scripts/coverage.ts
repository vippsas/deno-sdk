/**
 * Calculates and checks the branch coverage of a Deno project.
 *
 * @remarks
 * This script runs the tests with coverage enabled and then analyzes the coverage results.
 * If the branch coverage is below a specified threshold, it exits with an error.
 *
 * @param THRESHOLD - The minimum branch coverage threshold (in percentage) required for the project.
 */

// Minimum branch coverage threshold (in percentage)
const THRESHOLD = 90;

const getCommandOutput = async (command: Deno.Command) => {
  const { code, stdout, stderr } = await command.output();
  const errors = new TextDecoder().decode(stderr);
  if (code || errors) {
    console.error(cmdErr);
    Deno.exit(1);
  }
  const output = new TextDecoder().decode(stdout);
  return output;
};

// Run tests with coverage enabled
const testCmd = new Deno.Command(Deno.execPath(), {
  args: [
    "test",
    "--coverage",
  ],
});

// Check that the command ran successfully
getCommandOutput(testCmd);

// Calculate branch coverage
const covCmd = new Deno.Command(Deno.execPath(), {
  args: [
    "coverage",
    "./coverage",
  ],
});

// Check that the command ran successfully
const coverageReport = await getCommandOutput(covCmd);

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

if (branchTotal > THRESHOLD) {
  console.log(`Branch coverage is good: ${branchTotal}`);
} else {
  console.log(`Branch coverage is bad: ${branchTotal}`);
  Deno.exit(1);
}

/**
 * Calculates and checks the branch coverage of a Deno project.
 *
 * @remarks
 * This script runs the tests with coverage enabled and then analyzes the coverage results.
 * If the branch coverage is below a specified threshold, it exits with an error.
 *
 * @param THRESHOLD - The minimum branch coverage threshold (in percentage) required for the project.
 * @returns - None.
 */

// Minimum branch coverage threshold (in percentage)
const THRESHOLD = 90;

// Run tests with coverage enabled
const testCmd = new Deno.Command(Deno.execPath(), {
  args: [
    "test",
    "--coverage",
  ],
});

// Check that the command ran successfully
const output = await testCmd.output();
const testCmdErr = new TextDecoder().decode(output.stderr);
if (output.code || testCmdErr) {
  console.error(testCmdErr);
  Deno.exit(1);
}

// Calculate branch coverage
const covCmd = new Deno.Command(Deno.execPath(), {
  args: [
    "coverage",
    "./coverage",
  ],
});

// Check that the command ran successfully
const { code, stdout, stderr } = await covCmd.output();
const cmdErr = new TextDecoder().decode(stderr);
if (code || cmdErr) {
  console.error(cmdErr);
  Deno.exit(1);
}

// Decode the output
const cmdOut = new TextDecoder().decode(stdout);

// Remove ANSI escape codes
const words = cmdOut.replaceAll("\x1b", " ").split(" ");

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

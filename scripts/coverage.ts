import { trimAndParse } from "https://deno.land/x/ansi_escape_code@v1.0.2/mod.ts";

const THRESHOLD = 90;

const cmd = new Deno.Command(Deno.execPath(), {
  args: [
    "coverage",
    "./coverage",
  ],
});

const { code, stdout, stderr } = await cmd.output();
const cmdOut = new TextDecoder().decode(stdout);
const cmdErr = new TextDecoder().decode(stderr);

if (code || cmdErr) {
  console.error(cmdErr);
  Deno.exit(1);
}

const words = cmdOut.split("|");
const thirdLast = words.at(-3) || "";
const [trimmed, _annotations] = trimAndParse(thirdLast)
const branchTotal = trimmed.replaceAll(" ", "");
const result = parseFloat(branchTotal);

if (!branchTotal || isNaN(result)) {
   console.error("Could not retrieve branch coverage");
   Deno.exit(1);
}

if (result > THRESHOLD) {
  console.log(`Branch coverage is good: ${branchTotal}`);
} else {
  console.log(`Branch coverage is bad: ${branchTotal}`);
  Deno.exit(1)
}
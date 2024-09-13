import { Spinner } from "jsr:@std/cli/unstable-spinner";

type CommandResult = {
  ok: true;
  output: string;
} | {
  ok: false;
  error: string;
};

const getCommandOutput = async (
  command: Deno.Command,
  ignoreErrors = false,
): Promise<CommandResult> => {
  const { code, stdout, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);
  if ((code || error) && !ignoreErrors) {
    return { ok: false, error: error || "Unknown error" };
  }
  const output = new TextDecoder().decode(stdout);
  return { ok: true, output };
};

// The command might terminate the program.
export const run = async (
  command: string,
  spinnerMessage?: string,
  ignoreErrors = false,
) => {
  const spinner = spinnerMessage
    ? new Spinner({ message: spinnerMessage })
    : undefined;
  if (spinner) spinner.start();

  const words = command.split(" ");
  const cmd = words[0];
  const args = words.slice(1);
  const denoCmd = new Deno.Command(cmd, { args });

  const result = await getCommandOutput(denoCmd, ignoreErrors);
  if (spinner) spinner.stop();

  if (!result.ok) {
    console.error(result.error);
    Deno.exit(1);
  }
  return result.output;
};

const getCommandOutput = async (
  command: Deno.Command,
  ignoreErrors = false,
) => {
  const { code, stdout, stderr } = await command.output();
  const error = new TextDecoder().decode(stderr);
  if ((code || error) && !ignoreErrors) {
    console.error(error);
    Deno.exit(1);
  }
  const output = new TextDecoder().decode(stdout);
  return output;
};

// The command might terminate the program.
export const run = async (command: string, ignoreErrors = false) => {
  const words = command.split(" ");
  const cmd = words[0];
  const args = words.slice(1);
  const denoCmd = new Deno.Command(cmd, { args });

  const output = await getCommandOutput(denoCmd, ignoreErrors);
  return output;
};

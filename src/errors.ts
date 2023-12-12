import { RetryError } from "./deps.ts";

export const parseError = <TErr>(
  error: unknown,
): { ok: false; message: string; error?: TErr } => {
  if (error instanceof RetryError) { // If the retry was exhausted
    return {
      ok: false,
      message:
        "Could not get a response from the server after multiple attempts",
    };
  }
  if (
    error instanceof TypeError &&
    error.message.includes("error trying to connect")
  ) {
    return {
      ok: false,
      message: "Could not connect to Vipps MobilePay API",
    };
  }
  if (error instanceof Error) {
    return { ok: false, message: `${error.name} - ${error.message}` };
  }
  // Narrow down AccessTokenError
  if (
    typeof error === "object" && error !== null && "error" in error &&
    "error_description" in error && "trace_id" in error
  ) {
    return {
      ok: false,
      message: `${error.error} - ${error.error_description}`,
      error: error as TErr,
    };
  }
  // Narrow down Problem JSON
  if (
    typeof error === "object" && error !== null && "type" in error &&
    "title" in error && "status" in error
  ) {
    return {
      ok: false,
      message: `${error.status} - ${error.title}`,
      error: error as TErr,
    };
  }

  return { ok: false, message: String(error) };
};

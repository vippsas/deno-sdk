import { RetryError, STATUS_CODE } from "./deps.ts";
import { SDKError } from "./types.ts";

/**
 * Parses the error and returns an object with error details.
 * @template TErr - The type of the error object.
 * @param error - The error to be parsed.
 * @returns An object with error details.
 */
export const parseError = <TErr>(
  error: unknown,
  status?: number,
): SDKError<TErr> => {
  // Catch RetryError
  if (error instanceof RetryError) {
    return {
      ok: false,
      error: {
        message:
          "Retry limit reached. Could not get a response from the server",
      },
    };
  }

  // Catch connection errors
  if (
    error instanceof TypeError &&
    error.message.includes("error trying to connect")
  ) {
    return {
      ok: false,
      error: { message: "Could not connect to Vipps MobilePay API" },
    };
  }

  // Catch Forbidden
  if (status === STATUS_CODE.Forbidden) {
    return {
      ok: false,
      error: {
        message:
          "Your credentials are not authorized for this product, please visit portal.vipps.no",
      },
    };
  }

  // Catch regular errors
  if (error instanceof Error) {
    return { ok: false, error: { message: error.message } };
  }

  // If error is object, return it
  if (typeof error === "object") {
    return { ok: false, error: error as TErr };
  }

  // Default to error as string
  return { ok: false, error: { message: String(error) } };
};

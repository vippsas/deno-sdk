import { RetryError } from "@std/async";
import { STATUS_CODE } from "@std/http";
import type { SDKError } from "./types.ts";

/**
 * Parses the error and returns an object with error details.
 *
 * This function handles different types of errors, including retry errors,
 * connection errors, forbidden status codes, and generic errors. It returns
 * a standardized error object that can be used throughout the application.
 *
 * @template TErr - The type of the error object.
 * @param error - The error to be parsed.
 * @returns An object with error details.
 */
export const parseError = <TErr>(
  error: unknown,
  status?: number,
): SDKError<TErr> => {
  // Handle RetryError
  if (error instanceof RetryError) {
    return {
      ok: false,
      error: {
        message:
          "Retry limit reached. Could not get a response from the server",
      },
    };
  }

  // Handle connection errors
  if (
    error instanceof TypeError &&
    error.message.includes("error trying to connect")
  ) {
    return {
      ok: false,
      error: { message: "Could not connect to Vipps MobilePay API" },
    };
  }

  // Handle Forbidden status code
  if (status === STATUS_CODE.Forbidden) {
    return {
      ok: false,
      error: {
        message:
          "Your credentials are not authorized for this product, please visit portal.vipps.no",
      },
    };
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    return { ok: false, error: { message: error.message } };
  }

  // Handle object errors
  if (typeof error === "object" && error !== null) {
    return { ok: false, error: error as TErr };
  }

  // Default to treating error as a string
  return { ok: false, error: { message: String(error) } };
};

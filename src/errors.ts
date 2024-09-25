import type { SDKError } from "./types_external.ts";

/**
 * Parses the error and returns an object with error details.
 *
 * This function handles different types of errors, including retry errors,
 * connection errors, forbidden status codes, and generic errors. It returns
 * a standardized error object that can be used throughout the application.
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
  // Handle connection errors
  if (
    error instanceof TypeError &&
    error.message.includes("error trying to connect")
  ) {
    return {
      ok: false,
      error: new Error("Could not connect to Vipps MobilePay API"),
    };
  }

  // Handle Forbidden status code
  if (status === 403) {
    return {
      ok: false,
      error: new Error(
        "Your credentials are not authorized for this product, please visit portal.vipps.no",
      ),
    };
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    return { ok: false, error };
  }

  // Handle object errors
  if (typeof error === "object" && error !== null) {
    return { ok: false, error: error as TErr };
  }

  // Default to treating error as a string
  return { ok: false, error: new Error(String(error)) };
};

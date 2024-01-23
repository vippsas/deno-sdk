import { RetryError, STATUS_CODE } from "./deps.ts";
import { SDKError } from "./apis/types/shared_types.ts";
import { RecurringErrorFromAzure } from "./mod.ts";

/**
 * Checks if the provided JSON object is an instance of RetryError.
 * @param json The JSON object to check.
 * @returns True if the JSON object is an instance of RetryError,
 * false otherwise.
 */
export const isRetryError = (json: unknown) => {
  return json instanceof RetryError;
};

/**
 * Parses the error and returns an object with error details.
 * @returns An object with error details.
 */
export const parseRetryError = (): SDKError<undefined> => {
  return {
    ok: false,
    message: "Retry limit reached. Could not get a response from the server",
  };
};

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
  // Catch connection errors
  if (
    error instanceof TypeError &&
    error.message.includes("error trying to connect")
  ) {
    return {
      ok: false,
      message: "Could not connect to Vipps MobilePay API",
    };
  }

  // Catch Forbidden
  if (status === STATUS_CODE.Forbidden) {
    return {
      ok: false,
      message:
        "Your credentials are not authorized for this product, please visit portal.vipps.no",
    };
  }

  // Catch AccessTokenError
  if (
    typeof error === "object" && error !== null && "error" in error &&
    "error_description" in error
  ) {
    return {
      ok: false,
      message: `${error.error} - ${error.error_description}`,
      error: error as TErr,
    };
  }

  // Catch Recurring Azure Error
  if (
    typeof error === "object" && error !== null && "responseInfo" in error &&
    "result" in error
  ) {
    const azureError = error as RecurringErrorFromAzure;
    return {
      ok: false,
      message: azureError.result.message,
      error: error as TErr,
    };
  }

  // Catch regular errors
  if (error instanceof Error) {
    return { ok: false, message: `${error.name} - ${error.message}` };
  }

  // Default to error as string
  return { ok: false, message: "Unknown error" };
};

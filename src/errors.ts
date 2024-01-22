import { QrErrorResponse } from "./apis/types/qr_types.ts";
import { RetryError, STATUS_CODE } from "./deps.ts";
import { CheckoutErrorResponse } from "./apis/types/checkout_types.ts";
import { ProblemJSON, SDKError } from "./apis/types/shared_types.ts";
import { EPaymentErrorResponse } from "./apis/types/epayment_types.ts";
import { RecurringErrorFromAzure, RecurringErrorV3 } from "./mod.ts";

/**
 * Parses the given ProblemJSON and returns an object indicating an error.
 * @param error The ProblemJSON to parse.
 * @returns An object with `ok` set to `false` and the parsed `error`.
 */
export const parseProblemJSON = <TErr>(
  error: ProblemJSON,
): SDKError<TErr> => {
  // If we have details return them
  if (error.detail) {
    return { ok: false, message: error.detail, error: error as TErr };
  }

  // Catch EPayment and Webhook Problem JSON
  if ("extraDetails" in error && typeof error["extraDetails"] === "object") {
    const ePaymentError = error as EPaymentErrorResponse;
    const first = ePaymentError.extraDetails[0];
    const message = first && `${first.name} - ${first.reason}` ||
      "Unknown error";
    return { ok: false, message, error: error as TErr };
  }

  // Catch Checkout Problem JSON
  if (
    "errorCode" in error && "errors" in error &&
    typeof error["errors"] === "object"
  ) {
    const checkoutError = error as CheckoutErrorResponse;
    const [first] = Object.values(checkoutError.errors);
    const message = first && first[0] || "Unknown error";
    return { ok: false, message, error: error as TErr };
  }

  // Catch QR Problem JSON
  if (
    "invalidParams" in error && typeof error["invalidParams"] === "object"
  ) {
    const qrError = error as QrErrorResponse;
    const first = qrError.invalidParams && qrError.invalidParams[0];
    const message = first && `${first.name} - ${first.reason}` ||
      "Unknown error";
    return { ok: false, message, error: error as TErr };
  }

  // Catch Recurring Problem JSON
  if (
    "contextId" in error && "extraDetails" in error &&
    typeof error["extraDetails"] === "object"
  ) {
    const recurringError = error as RecurringErrorV3;
    const first = recurringError.extraDetails && recurringError.extraDetails[0];
    const message = first && `${first.field} - ${first.text}` ||
      "Unknown error";
    return { ok: false, message, error: error as TErr };
  }

  return { ok: false, message: "Unknown error", error: error as TErr };
};

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

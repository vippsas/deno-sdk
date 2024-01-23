import { CheckoutErrorResponse } from "./apis/types/checkout_types.ts";
import { EPaymentErrorResponse } from "./apis/types/epayment_types.ts";
import { QrErrorResponse } from "./apis/types/qr_types.ts";
import { RecurringErrorV3 } from "./apis/types/recurring_types.ts";
import { ProblemJSON, SDKError } from "./apis/types/shared_types.ts";

/**
 * Parses the given ProblemJSON and returns an object indicating an error.
 * @param error The ProblemJSON to parse.
 * @returns An object with `ok` set to `false` and the parsed `error`.
 */
export const parseProblemJSON = <TErr>(
  error: unknown,
): SDKError<TErr> => {
  // If we have details return them
  if (isProblemJSONwithDetail(error)) {
    return { ok: false, message: error.detail, error: error as TErr };
  }

  // Catch EPayment and Webhook Problem JSON
  if (isEPaymentProblemJSON(error)) {
    return {
      ok: false,
      message: getEPaymentMessage(error),
      error: error as TErr,
    };
  }

  // Catch Checkout Problem JSON
  if (isCheckoutProblemJSON(error)) {
    return {
      ok: false,
      message: getCheckoutMessage(error),
      error: error as TErr,
    };
  }

  // Catch QR Problem JSON
  if (isQrProblemJSON(error)) {
    return { ok: false, message: getQrMessage(error), error: error as TErr };
  }

  // Catch Recurring Problem JSON
  if (isRecurringProblemJSON(error)) {
    return {
      ok: false,
      message: getRecurringMessage(error),
      error: error as TErr,
    };
  }

  return { ok: false, message: "Unknown error", error: error as TErr };
};

/**
 * Checks if the given JSON object is a ProblemJSON with a detail property.
 *
 * @param json The JSON object to check.
 * @returns True if the JSON object is a ProblemJSON with a detail property, false otherwise.
 */
const isProblemJSONwithDetail = (
  json: unknown,
): json is ProblemJSON & { detail: string } => {
  return (
    typeof json === "object" && json !== null &&
    "detail" in json && typeof json["detail"] === "string"
  );
};

/**
 * Checks if the provided JSON object is an EPaymentErrorResponse.
 *
 * @param json - The JSON object to check.
 * @returns True if the JSON object is an EPaymentErrorResponse, false otherwise.
 */
const isEPaymentProblemJSON = (
  json: unknown,
): json is EPaymentErrorResponse => {
  return (
    typeof json === "object" && json !== null &&
    "extraDetails" in json && "traceId" in json
  );
};

/**
 * Checks if the provided JSON object is a valid QrErrorResponse.
 *
 * @param json The JSON object to check.
 * @returns True if the JSON object is a valid QrErrorResponse, false otherwise.
 */
const isQrProblemJSON = (json: unknown): json is QrErrorResponse => {
  return (
    typeof json === "object" && json !== null &&
    "invalidParams" in json
  );
};

/**
 * Checks if the provided JSON object is a CheckoutErrorResponse.
 *
 * @param json The JSON object to check.
 * @returns True if the JSON object is a CheckoutErrorResponse, false otherwise.
 */
const isCheckoutProblemJSON = (
  json: unknown,
): json is CheckoutErrorResponse => {
  return (
    typeof json === "object" && json !== null &&
    "errorCode" in json && "errors" in json &&
    typeof json["errors"] === "object" && json["errors"] !== null
  );
};

/**
 * Checks if the provided JSON object is a valid RecurringErrorV3.
 *
 * @param json The JSON object to check.
 * @returns True if the JSON object is a valid RecurringErrorV3, false otherwise.
 */
const isRecurringProblemJSON = (
  json: unknown,
): json is RecurringErrorV3 => {
  return (
    typeof json === "object" && json !== null &&
    "extraDetails" in json
  );
};

/**
 * Returns the error message for the EPaymentErrorResponse.
 * If the error has extra details, it returns the first detail's name and reason.
 * Otherwise, it returns "Unknown error".
 *
 * @param error - The EPaymentErrorResponse object.
 * @returns The error message.
 */
const getEPaymentMessage = (error: EPaymentErrorResponse) => {
  if (error.extraDetails && error.extraDetails.length > 0) {
    const first = error.extraDetails[0];
    return `${first.name} - ${first.reason}`;
  }
  return "Unknown error";
};

/**
 * Retrieves the checkout message from the given error response.
 * If the error response contains any errors, it returns the first error message.
 * Otherwise, it returns "Unknown error".
 *
 * @param error - The checkout error response.
 * @returns The checkout message.
 */
const getCheckoutMessage = (error: CheckoutErrorResponse) => {
  const [first] = Object.values(error.errors);
  if (first && first.length > 0) {
    return first[0];
  }
  return "Unknown error";
};

/**
 * Retrieves the QR message from the given QrErrorResponse.
 *
 * @param error - The QrErrorResponse object.
 * @returns The QR message if available, otherwise "Unknown error".
 */
const getQrMessage = (error: QrErrorResponse) => {
  if (error.invalidParams && error.invalidParams.length > 0) {
    const first = error.invalidParams[0];
    return `${first.name} - ${first.reason}`;
  }
  return "Unknown error";
};

/**
 * Retrieves the recurring error message from the given RecurringErrorV3 object.
 * If the error object has extra details, it returns the first field and text as a formatted string.
 * Otherwise, it returns "Unknown error".
 *
 * @param error - The RecurringErrorV3 object.
 * @returns The recurring error message.
 */
const getRecurringMessage = (error: RecurringErrorV3) => {
  if (error.extraDetails && error.extraDetails.length > 0) {
    const first = error.extraDetails[0];
    return `${first.field} - ${first.text}`;
  }
  return "Unknown error";
};

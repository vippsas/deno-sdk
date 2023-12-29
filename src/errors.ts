import { QrErrorResponse } from "./apis/types/qr_types.ts";
import { RetryError } from "./deps.ts";

/**
 * Parses the error and returns an object with error details.
 * @template TErr - The type of the error object.
 * @param error - The error to be parsed.
 * @returns An object with error details.
 */
export const parseError = <TErr>(
  error: unknown,
): { ok: false; message: string; error?: TErr } => {
  // Catch retry errors
  if (error instanceof RetryError) {
    return {
      ok: false,
      message:
        "Could not get a response from the server after multiple attempts",
    };
  }

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
  if (error instanceof Error && error.message.includes("Forbidden")) {
    return {
      ok: false,
      message:
        "Your credentials are not authorized for this product, please visit portal.vipps.no",
    };
  }

  // Catch regular errors
  if (error instanceof Error) {
    return { ok: false, message: `${error.name} - ${error.message}` };
  }

  // Catch AccessTokenError
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

  // Catch Problem JSON
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

  // Catch QR Error JSON
  if (
    typeof error === "object" && error !== null && "type" in error &&
    "title" in error && "detail" in error && "instance" in error &&
    "invalidParams" in error
  ) {
    const qrError = error as QrErrorResponse;
    const message = qrError.invalidParams?.[0]?.reason ?? qrError.title;
    return {
      ok: false,
      message,
      error: error as TErr,
    };
  }

  // Default to error as string
  return { ok: false, message: String(error) };
};

import { ClientConfig, RequestData } from "./types.ts";

/**
 * Validates the request data based on the client configuration.
 *
 * This function checks if certain operations are being attempted in a non-test
 * environment and returns an appropriate error message if validation fails.
 *
 * @param {RequestData<unknown, unknown>} requestData - The request data to be validated.
 * @param {ClientConfig} cfg - The client configuration.
 * @returns {string | undefined} A string if validation fails, otherwise undefined.
 */
export const validateRequestData = (
  requestData: RequestData<unknown, unknown>,
  cfg: ClientConfig,
): string | undefined => {
  const { url } = requestData;
  const { useTestMode } = cfg;

  // ePayment validation
  if (!useTestMode && url.includes("/epayment/") && url.includes("/approve")) {
    return "forceApprove is only available in the test environment";
  }

  // Agreement validation
  if (!useTestMode && url.includes("/recurring/") && url.includes("/accept")) {
    return "forceAccept is only available in the test environment";
  }

  // No validation errors
  return undefined;
};

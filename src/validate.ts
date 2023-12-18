import { ClientConfig, RequestData } from "./types.ts";

/**
 * Validates the request data.
 *
 * @param requestData - The request data to be validated.
 * @param cfg - The client configuration.
 * @returns A string if validation fails, otherwise undefined.
 */
export const validateRequestData = (
  requestData: RequestData<unknown, unknown>,
  cfg: ClientConfig,
): string | undefined => {
  
  // ePayment validation
  if (
    !cfg.useTestMode && requestData.url.includes("/epayment/") &&
    requestData.url.includes("/approve")
  ) {
    return "forceApprove is only available in the test environment";
  }

  // Agreement validation
  if (
    !cfg.useTestMode && requestData.url.includes("/recurring/") &&
    requestData.url.includes("/accept")
  ) {
    return "forceAccept is only available in the test environment";
  }
};

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
  if (
    !cfg.useTestMode && requestData.url.includes("/epayment/") &&
    requestData.url.includes("/approve")
  ) {
    return "forceApprove is only available in the test environment";
  }
};

import { ClientConfig, RequestData } from "./types.ts";

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

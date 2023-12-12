import {
  BaseClient,
  ClientConfig,
  ClientResponse,
  RequestData,
} from "./types.ts";
import { buildRequest, fetchRetry } from "./base_client_helper.ts";
import { parseError } from "./errors.ts";
import { validateRequestData } from "./validate.ts";

export const baseClient = (cfg: ClientConfig): BaseClient =>
  ({
    async makeRequest<TOk, TErr>(
      requestData: RequestData<TOk, TErr>,
    ): Promise<ClientResponse<TOk, TErr>> {
      const validated = validateRequestData(requestData, cfg);

      if (typeof validated === "string") {
        return { ok: false, message: validated };
      }
      const request = buildRequest(cfg, requestData);
      try {
        const res = await fetchRetry<TOk, TErr>(request, cfg.retryRequests);
        return res;
      } catch (error: unknown) {
        return parseError<TErr>(error);
      }
    },
  }) as const;

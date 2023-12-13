import {
  BaseClient,
  ClientConfig,
  ClientResponse,
  RequestData,
} from "./types.ts";
import { buildRequest, fetchRetry } from "./base_client_helper.ts";
import { parseError } from "./errors.ts";
import { validateRequestData } from "./validate.ts";

/**
 * Creates a base client with the given configuration.
 *
 * @param cfg - The client configuration.
 * @returns The base client.
 */
export const baseClient = (cfg: ClientConfig): BaseClient =>
  ({
    /**
     * Makes a request to the server.
     *
     * @template TOk The type of the successful response.
     * @template TErr The type of the error response.
     * @param requestData The request data.
     * @returns A promise that resolves to a ClientResponse object containing the response data.
     */
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

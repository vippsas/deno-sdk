import type {
  BaseClient,
  ClientResponse,
  RequestData,
} from "./types_internal.ts";
import type { ClientConfig } from "./types_external.ts";
import { buildRequest } from "./base_client_helper.ts";
import { validateRequestData } from "./validate.ts";
import { fetchRetry } from "./fetch.ts";

/**
 * Creates a base client with the given configuration.
 *
 * @param {ClientConfig} cfg - The client configuration.
 * @returns {BaseClient} The base client.
 */
export const baseClient = (cfg: ClientConfig, sdkVersion: string): BaseClient =>
  ({
    sdkVersion,
    /**
     * Makes a request to the server.
     *
     * @template TOk - The type of the successful response.
     * @template TErr - The type of the error response.
     * @param {RequestData<TOk, TErr>} requestData - The request data.
     * @returns {Promise<ClientResponse<TOk, TErr>>} A promise that resolves to a ClientResponse object containing the response data.
     */
    async makeRequest<TOk, TErr>(
      requestData: RequestData<TOk, TErr>,
    ): Promise<ClientResponse<TOk, TErr>> {
      // Validate the request data
      const validationError = validateRequestData(requestData, cfg);
      if (validationError) {
        return { ok: false, error: new Error(validationError) };
      }

      // Build the request
      const request = buildRequest(cfg, requestData, this.sdkVersion);

      // Make the request with retry logic
      const response = await fetchRetry<TOk, TErr>(
        request,
        cfg.retryRequests,
      );
      return response;
    },
  }) as const;

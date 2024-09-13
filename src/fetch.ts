import { retry } from "./deps.ts";
import { parseError } from "./errors.ts";
import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseResponseToJson,
} from "./fetch_helper.ts";
import type { ClientResponse } from "./types_external.ts";

/**
 * Executes a fetch request with optional retry logic.
 *
 * @param {Request} request - The request to be executed.
 * @param {boolean} [retryRequest=true] - Whether to retry the request if it fails.
 * @returns {Promise<ClientResponse<TOk, TErr>>} A promise that resolves to the response of the request.
 */
export const fetchRetry = async <TOk, TErr>(
  request: Request,
  retryRequest: boolean = true,
): Promise<ClientResponse<TOk, TErr>> => {
  // Execute request without retry
  if (!retryRequest) {
    return await fetchJSON<TOk, TErr>(request);
  }
  // Execute request using retry
  const req = retry(async () => {
    return await fetchJSON<TOk, TErr>(request);
  }, {
    multiplier: 2,
    maxTimeout: 3000,
    maxAttempts: 3,
    minTimeout: 1000,
    jitter: 0,
  });
  return req;
};

/**
 * Fetches JSON data from the specified request.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 * @param {Request} request - The request to fetch JSON data from.
 * @returns {Promise<ClientResponse<TOk, TErr>>} A ClientResponse object containing the fetched data.
 */
export const fetchJSON = async <TOk, TErr>(
  request: Request,
): Promise<ClientResponse<TOk, TErr>> => {
  const response = await fetch(request);

  /**
   * Check if the response is empty.
   */
  if (response.status === 204) {
    return { ok: true, data: {} as TOk };
  }

  /**
   * If a Server error is returned, throw an error.
   * The request will be retried if retryRequest is true.
   */
  if (isServerErrorStatus(response.status)) {
    throw new Error(response.statusText);
  }

  const json = await parseResponseToJson(response);

  /**
   * For any other type of error, return an Error object.
   */
  if (!isSuccessfulStatus(response.status)) {
    return parseError<TErr>(json, response.status);
  }

  return { ok: true, data: json as TOk };
};

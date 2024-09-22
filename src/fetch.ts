import { parseError } from "./errors.ts";
import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseResponseToJson,
} from "./fetch_helper.ts";
import type { ClientResponse } from "./types_internal.ts";

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
  // Delays between retries in milliseconds, if retryRequest is true.
  // If retryRequest is false, the array will be empty.
  const delays = retryRequest ? [1000, 3000] : [];

  let attempt = 0;
  while (true) {
    try {
      return await fetchJSON<TOk, TErr>(request);
    } catch (_error) {
      if (attempt === delays.length) {
        return {
          ok: false,
          error: {
            message:
              `Retry limit reached. Could not get a response from the server after ${attempt} attempts`,
          },
        };
      }
      await new Promise((r) => setTimeout(r, delays[attempt]));
      attempt++;
    }
  }
};

/**
 * Fetches JSON data from the specified request.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 * @param {Request} request - The request to fetch JSON data from.
 * @returns {Promise<ClientResponse<TOk, TErr>>} A ClientResponse object containing the fetched data.
 * @throws {Error} Throws an error if the response status is a server error.
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

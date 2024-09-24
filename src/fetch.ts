import { parseError } from "./errors.ts";
import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseResponseToJson,
} from "./fetch_helper.ts";
import type { ClientResponse } from "./types_internal.ts";

/**
 * Fetches a JSON response from the given request with retry logic.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 * @param {Request} request - The request to fetch.
 * @param {boolean} [retryRequest=true] - Whether to retry the request on failure.
 * @returns {Promise<ClientResponse<TOk, TErr>>} A promise that resolves to a ClientResponse object.
 */
export const fetchRetry = <TOk, TErr>(
  request: Request,
  retryRequest: boolean = true,
): Promise<ClientResponse<TOk, TErr>> => {
  const delays = [1000, 3000];

  /**
   * Attempts to fetch the request recursively with retry logic.
   *
   * @param {number} attempt - The current attempt number.
   * @returns {Promise<ClientResponse<TOk, TErr>>} A promise that resolves to a ClientResponse object.
   */
  const attemptFetch = async (
    attempt: number,
  ): Promise<ClientResponse<TOk, TErr>> => {
    const result = await fetchJSON<TOk, TErr>(request);
    if (result.ok || !retryRequest || !result.retry) {
      return result;
    }
    if (attempt === delays.length) {
      return {
        ok: false,
        error: new Error(
          `Retry limit reached. Could not get a response from the server after ${attempt} attempts`,
        ),
      };
    }
    await new Promise((r) => setTimeout(r, delays[attempt]));
    return attemptFetch(attempt + 1);
  };

  return attemptFetch(0);
};

/**
 * Fetches a JSON response from the given request.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 * @param {Request} request - The request to fetch.
 * @returns {Promise<ClientResponse<TOk, TErr>>} A promise that resolves to a ClientResponse object.
 */
export const fetchJSON = async <TOk, TErr>(
  request: Request,
): Promise<ClientResponse<TOk, TErr>> => {
  const response = await fetch(request);

  /**
   * Check if the response is empty.
   * @returns {ClientResponse<TOk, TErr>} An object with ok set to true and empty data.
   */
  if (response.status === 204) {
    return { ok: true, data: {} as TOk };
  }

  /**
   * If a Server error is returned, return an Error object with retry set to true.
   * @returns {ClientResponse<TOk, TErr>} An object with ok set to false, an error message, and retry set to true.
   */
  if (isServerErrorStatus(response.status)) {
    return {
      ok: false,
      error: new Error(
        `Server error: ${response.status} ${response.statusText}`,
      ),
      retry: true,
    };
  }

  const json = await parseResponseToJson(response);

  /**
   * For any other type of error, return an Error object without retry.
   * @returns {ClientResponse<TOk, TErr>} An object with ok set to false and an error message.
   */
  if (!isSuccessfulStatus(response.status)) {
    return parseError<TErr>(json, response.status);
  }

  /**
   * Return the successful response data.
   * @returns {ClientResponse<TOk, TErr>} An object with ok set to true and the parsed JSON data.
   */
  return { ok: true, data: json as TOk };
};

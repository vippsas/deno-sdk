import {
  isServerErrorStatus,
  isSuccessfulStatus,
  retry,
  STATUS_CODE,
} from "./deps.ts";
import { parseError } from "./errors.ts";
import { ClientResponse } from "./types.ts";

/**
 * Executes a fetch request with optional retry logic.
 *
 * @param request - The request to be executed.
 * @param retryRequest - Whether to retry the request if it fails. Default is true.
 * @returns A promise that resolves to the response of the request.
 */
export const fetchRetry = async <TOk, TErr>(
  request: Request,
  retryRequest = true,
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
 * @param request - The request to fetch JSON data from.
 * @returns A ClientResponse object containing the fetched data.
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 */
export const fetchJSON = async <TOk, TErr>(
  request: Request,
): Promise<ClientResponse<TOk, TErr>> => {
  const response = await fetch(request);

  /**
   * Check if the response is empty.
   */
  if (response.status === STATUS_CODE.NoContent) {
    return { ok: true, data: {} as TOk };
  }
  /**
   * Parse the response body as JSON. We DO NOT trust that the server returns
   * a valid JSON response.
   */
  const responseBody = await response.text();
  let json = {};
  try {
    json = JSON.parse(responseBody);
  } catch(err) {
    if(err instanceof SyntaxError) {
      json = {data: responseBody, ok: true}
    } else {
      throw new Error("Unknown error during parsing of HTTP Response Body. " + err)
    }
  }

  /**
   * If a Server error is returned, throw an error.
   * The request will be retried if retryRequest is true.
   */
  if (isServerErrorStatus(response.status)) {
    throw new Error(response.statusText);
  }

  /**
   * If the response status is a successful status, return the JSON as TOk.
   */
  if (isSuccessfulStatus(response.status)) {
    return { ok: true, data: json as TOk };
  }

  /**
   * For any other type of error, return an Error object.
   */
  return parseError<TErr>(json, response.status);
};

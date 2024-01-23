import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseMediaType,
  retry,
  STATUS_CODE,
} from "./deps.ts";
import { parseError } from "./errors.ts";
import { parseProblemJSON } from "./problem.ts";
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
   * Check MIME type of the response, assuming headers are case insensitive
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
   */
  const contentHeader = response.headers.get("content-type") || "";
  const mediaType = parseMediaType(contentHeader)[0] || "";

  /**
   * If the MIME is a ProblemJSON, parse it and return it as an error.
   * By returning an error object, the request will not be retried.
   *
   * Read more about ProblemJSON here: https://tools.ietf.org/html/rfc7807
   */
  if (mediaType === "application/problem+json") {
    const error = await response.json();
    return parseProblemJSON<TErr>(error);
  }

  /**
   * Parse the response body as JSON. We trust that the server returns
   * a valid JSON response.
   */
  const json = await response.json();

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

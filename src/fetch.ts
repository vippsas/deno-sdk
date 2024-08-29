import {
  isServerErrorStatus,
  isSuccessfulStatus,
  STATUS_CODE,
} from "@std/http";
import { parseMediaType } from "@std/media-types";
import { retry } from "@std/async";
import { parseError } from "./errors.ts";
import type { ClientResponse } from "./types.ts";

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
  if (response.status === STATUS_CODE.NoContent) {
    return { ok: true, data: {} as TOk };
  }

  /**
   * If a Server error is returned, throw an error.
   * The request will be retried if retryRequest is true.
   */
  if (isServerErrorStatus(response.status)) {
    throw new Error(response.statusText);
  }

  const json = await parseResponse(response);

  /**
   * For any other type of error, return an Error object.
   */
  if (!isSuccessfulStatus(response.status)) {
    return parseError<TErr>(json, response.status);
  }

  return { ok: true, data: json as TOk };
};

/**
 * Parses the response based on its content type.
 *
 * @param {Response} response - The response to parse.
 * @returns {Promise<unknown>} The parsed response data.
 */
const parseResponse = async (response: Response): Promise<unknown> => {
  if (isText(response) || isContentLengthZero(response)) {
    return { text: await response.text() };
  }
  return response.json();
};

/**
 * Checks if the response content type is text/plain.
 *
 * @param {Response} response - The response to check.
 * @returns {boolean} True if the content type is text/plain, otherwise false.
 */
const isText = (response: Response): boolean => {
  const mediaType = getMediaType(response);
  return mediaType === "text/plain";
};

/**
 * Checks if the response content length is zero.
 *
 * @param {Response} response - The response to check.
 * @returns {boolean} True if the content length is zero, otherwise false.
 */
const isContentLengthZero = (response: Response): boolean => {
  return response.headers.get("content-length") === "0";
};

/**
 * Gets the media type from the response headers.
 *
 * @param {Response} response - The response to get the media type from.
 * @returns {string | undefined} The media type, or undefined if not found.
 */
export const getMediaType = (response: Response): string | undefined => {
  /**
   * Check MIME type of the response, assuming headers are case insensitive
   */
  const contentHeader = response.headers.get("content-type");
  if (!contentHeader) {
    return undefined;
  }
  const mediaType = parseMediaType(contentHeader);

  return mediaType[0];
};

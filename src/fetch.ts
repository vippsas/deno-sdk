import {
  isServerErrorStatus,
  isSuccessfulStatus,
  parseMediaType,
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
   * If a Server error is returned, throw an error.
   * The request will be retried if retryRequest is true.
   */
  if (isServerErrorStatus(response.status)) {
    throw new Error(response.statusText);
  }


  /**
   * Check if the content type is text/plain or has zero content length.
   */
  const json = isText(response) || isContentLengthZero(response)
    ? { text: await response.text() }
    : await response.json();

  /**
   * For any other type of error, return an Error object.
   */
  if (!isSuccessfulStatus(response.status)) {
    return parseError<TErr>(json, response.status);
  }

  return { ok: true, data: json as TOk };
};

const isText = (response: Response): boolean => {
  const mediaType = getMediaType(response);
  return mediaType === "text/plain";
};

const isContentLengthZero = (response: Response): boolean => {
  const contentLength = response.headers.get("content-length");
  return contentLength === "0";
}

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

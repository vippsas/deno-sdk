import { filterKeys, isErrorStatus, retry } from "./deps.ts";
import { parseError } from "./errors.ts";
import {
  ClientConfig,
  ClientResponse,
  DefaultHeaders,
  OmitHeaders,
  RequestData,
} from "./types.ts";

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
 * @param request - The request to fetch JSON data from.
 * @returns A promise that resolves to a ClientResponse object containing the fetched data.
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error response data.
 */
export const fetchJSON = async <TOk, TErr>(
  request: Request,
): Promise<ClientResponse<TOk, TErr>> => {
  const response = await fetch(request);

  if (isErrorStatus(response.status)) {
    // Bad Request
    if (response.status === 400) {
      const error = await response.json();
      return parseError<TErr>(error);
    } else {
      // Throwing an error here will trigger a retry
      throw new Error(response.statusText);
    }
  }
  const text = await response.text();
  // Handle empty response body
  if (text === "") {
    return { ok: true, data: {} as TOk };
  }
  const json = JSON.parse(text);
  return { ok: true, data: json as TOk };
};

/**
 * Builds a Request object based on the provided configuration and request data.
 * @param cfg - The client configuration.
 * @param requestData - The request data containing method, headers, token, body, and URL.
 * @returns A Request object.
 */
export const buildRequest = (
  cfg: ClientConfig,
  requestData: RequestData<unknown, unknown>,
): Request => {
  const baseURL = cfg.useTestMode
    ? "https://apitest.vipps.no"
    : "https://api.vipps.no";

  const reqInit: RequestInit = {
    method: requestData.method,
    headers: getHeaders(
      cfg,
      requestData.token,
      requestData.additionalHeaders,
      requestData.omitHeaders,
    ),
    body: requestData.body ? JSON.stringify(requestData.body) : undefined,
  };
  return new Request(`${baseURL}${requestData.url}`, reqInit);
};

/**
 * Returns a headers object based on the provided client configuration.
 *
 * @param cfg - The client configuration.
 * @param additionalHeaders - Additional headers to include,
 * these will not override default headers.
 * @param omitHeaders - Headers to omit from the returned object.
 * @param token - The token to use in the Authorization header.
 * @returns A headers object.
 */
export const getHeaders = (
  cfg: ClientConfig,
  token?: string,
  additionalHeaders?: Record<string, string>,
  omitHeaders: OmitHeaders = [],
): Record<string, string> => {
  const defaultHeaders: DefaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token || ""}`,
    "User-Agent": getUserAgent(),
    "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
    "Merchant-Serial-Number": cfg.merchantSerialNumber,
    "Vipps-System-Name": cfg.systemName || "",
    "Vipps-System-Version": cfg.systemVersion || "",
    "Vipps-System-Plugin-Name": cfg.pluginName || "",
    "Vipps-System-Plugin-Version": cfg.pluginVersion || "",
    "Idempotency-Key": crypto.randomUUID(),
  };

  // Remove omitted headers
  const trimmedHeaders = filterKeys(
    defaultHeaders,
    (header) => !omitHeaders.includes(header as OmitHeaders[number]),
  );

  // Add additional headers
  return {
    ...additionalHeaders,
    ...trimmedHeaders,
  };
};

/**
 * Returns the user agent string for the client.
 * @returns The user agent string.
 */
export const getUserAgent = (): string => {
  const metaUrl = import.meta.url;
  const userAgent = createSDKUserAgent(metaUrl);
  return userAgent;
};

/**
 * Creates a user agent string based on the provided meta URL.
 * The function is meant to receive import.meta.url (that will returns the URL of the current module).
 * Read more in the Deno docs in Import Meta
 * @param metaUrl - The meta URL of the module.
 * @returns The user agent string.
 */
export const createSDKUserAgent = (metaUrl: string): string => {
  const url = new URL(metaUrl);

  let userAgent = "Vipps/Deno SDK/";
  // Check if the module was loaded from deno.land
  if (
    url.host === "deno.land" &&
    url.pathname.includes("vipps_mobilepay_sdk")
  ) {
    // Extract the module version from the URL
    const sdkVersion = url.pathname.split("@")[1].split("/")[0];
    userAgent += sdkVersion;
  } // Or if the module was loaded from a local file
  else if (url.protocol === "file:") {
    userAgent += "local";
  } // Otherwise, we don't know where the module was loaded from
  else {
    userAgent += "unknown";
  }
  return userAgent;
};

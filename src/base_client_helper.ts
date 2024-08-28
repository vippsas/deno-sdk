import { filterKeys } from "@std/collections";
import {
  ClientConfig,
  DefaultHeaders,
  OmitHeaders,
  RequestData,
} from "./types.ts";

/**
 * This is a workaround for `crypto.randomUUID` not being available in
 * Node.js 18. This will be removed after Node.js 18 reaches End-of-Life
 * 30 Apr 2025.
 */
import { uuidv7 } from "uuidv7";

/**
 * Builds a Request object based on the provided configuration and request data.
 *
 * @param {ClientConfig} cfg - The client configuration.
 * @param {RequestData<unknown, unknown>} requestData - The request data containing method, headers, token, body, and URL.
 * @returns {Request} A Request object.
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
 * @param {ClientConfig} cfg - The client configuration.
 * @param {string} [token] - The token to use in the Authorization header.
 * @param {Record<string, string>} [additionalHeaders] - Additional headers to include, these will not override default headers.
 * @param {OmitHeaders} [omitHeaders=[]] - Headers to omit from the returned object.
 * @returns {Record<string, string>} A headers object.
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
    "Idempotency-Key": uuidv7(),
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
 *
 * @returns {string} The user agent string.
 */
export const getUserAgent = (): string => {
  // If the sdk is loaded using require, import.meta.url will be undefined
  const metaUrl: string | undefined = import.meta.url;

  const userAgent = createSDKUserAgent(metaUrl);
  return userAgent;
};

/**
 * Creates a user agent string based on the provided meta URL.
 * The function is meant to receive import.meta.url (that will returns the URL of the current module).
 * Read more in the Deno docs in Import Meta
 *
 * @param {string | undefined} metaUrl - The meta URL of the module.
 * @returns {string} The user agent string.
 */
export const createSDKUserAgent = (metaUrl: string | undefined): string => {
  if (!metaUrl) {
    return "Vipps/Deno SDK/npm-require";
  }

  const url = new URL(metaUrl);

  // Check if the module was loaded from deno.land
  if (
    url.host === "deno.land" &&
    url.pathname.includes("vipps_mobilepay_sdk")
  ) {
    // Extract the module version from the URL
    const sdkVersion = url.pathname.split("@")[1].split("/")[0];
    return `Vipps/Deno SDK/${sdkVersion}`;
  } // Or if the module was loaded from npm
  else if (url.pathname.includes("node_modules")) {
    return `Vipps/Deno SDK/npm-module`;
  }
  // Otherwise, we don't know where the module was loaded from
  return `Vipps/Deno SDK/unknown`;
};

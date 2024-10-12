import type {
  DefaultHeaders,
  InternalConfig,
  OmitHeaders,
  RequestData,
} from "./types_internal.ts";
import type { ClientConfig } from "./types_external.ts";
import { uuid } from "./deps.ts";

/**
 * Builds a Request object based on the provided configuration and request data.
 *
 * @param {ClientConfig} cfg - The client configuration.
 * @param {RequestData<unknown, unknown>} requestData - The request data containing method, headers, token, body, and URL.
 * @returns {Request} A Request object.
 */
export const buildRequest = (
  cfg: InternalConfig,
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
  cfg: InternalConfig,
  token?: string,
  additionalHeaders?: Record<string, string>,
  omitHeaders: OmitHeaders = [],
): Record<string, string> => {
  const defaultHeaders: DefaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token || ""}`,
    "User-Agent": getUserAgent(cfg.version, import.meta.url),
    "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
    "Merchant-Serial-Number": cfg.merchantSerialNumber,
    "Vipps-System-Name": cfg.systemName || "",
    "Vipps-System-Version": cfg.systemVersion || "",
    "Vipps-System-Plugin-Name": cfg.pluginName || "",
    "Vipps-System-Plugin-Version": cfg.pluginVersion || "",
    "Idempotency-Key": uuid.generate(),
  };

  return createHeaders(defaultHeaders, omitHeaders, additionalHeaders);
};

/**
 * Filters out specified headers from the default headers.
 *
 * @param {Record<string, string>} headers - The headers object to filter.
 * @param {string[]} omitHeaders - The list of headers to omit.
 * @returns {Record<string, string>} The filtered headers object.
 */
export const filterHeaders = (
  headers: Record<string, string>,
  omitHeaders: string[],
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(headers).filter(([key]) => !omitHeaders.includes(key)),
  );
};

/**
 * Adds additional headers to the default headers without overwriting existing headers.
 *
 * @param {Record<string, string>} defaultHeaders - The default headers object.
 * @param {Record<string, string>} additionalHeaders - The additional headers to add.
 * @returns {Record<string, string>} The combined headers object.
 */
export const addHeaders = (
  defaultHeaders: Record<string, string>,
  additionalHeaders: Record<string, string>,
): Record<string, string> => {
  return { ...additionalHeaders, ...defaultHeaders };
};

/**
 * Creates a new headers object by omitting specified headers from the default headers
 * and adding additional headers.
 *
 * @param {Record<string, string>} defaultHeaders - The default headers object.
 * @param {string[]} omitHeaders - The list of headers to omit.
 * @param {Record<string, string>} [additionalHeaders={}] - The additional headers to add.
 * @returns {Record<string, string>} The new headers object.
 */
export const createHeaders = (
  defaultHeaders: Record<string, string>,
  omitHeaders: string[],
  additionalHeaders: Record<string, string> = {},
): Record<string, string> => {
  const combinedHeaders = addHeaders(defaultHeaders, additionalHeaders);
  return filterHeaders(combinedHeaders, omitHeaders);
};

/**
 * Generates a User-Agent string for the SDK.
 *
 * @param {string} version - The version of the SDK.
 * @param {string | undefined} moduleURL - The URL of the module. If the SDK is loaded using require, this will be undefined.
 * @returns {string} The generated User-Agent string.
 */
export const getUserAgent = (version: string, moduleURL: string | undefined): string => {
  // If the sdk is loaded using require, import.meta.url will be undefined
  if (!moduleURL) {
    return `Vipps/Deno-SDK/npm-require/${version}`;
  }

  const userAgent = `Vipps/Deno-SDK/${getModuleSource(moduleURL)}/${version}`;
  return userAgent;
};

export const getModuleSource = (moduleUrl: string): string => {
  const url = new URL(moduleUrl);

  if (url.pathname.includes("node_modules")) {
    return "npm-module";
  }
  if (url.host === "npm.jsr.io") {
    return "jsr-npm";
  }
  if (url.host === "jsr.io") {
    return "jsr";
  }
  if (url.host === "deno.land") {
    return "deno-land";
  }
  return "unknown";
};

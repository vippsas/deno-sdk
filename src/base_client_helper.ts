import type {
  DefaultHeaders,
  OmitHeaders,
  RequestData,
} from "./types_internal.ts";
import type { ClientConfig } from "./types_external.ts";
import { uuid } from "./deps.ts";

export const buildRequest = (
  cfg: ClientConfig,
  requestData: RequestData<unknown, unknown>,
  sdkVersion: string = "unknown",
): Request => {
  const baseURL = cfg.useTestMode
    ? "https://apitest.vipps.no"
    : "https://api.vipps.no";

  const userAgent = getUserAgent(sdkVersion, import.meta.url);

  const reqInit: RequestInit = {
    method: requestData.method,
    headers: buildHeaders(
      cfg,
      requestData.token,
      userAgent,
      requestData.additionalHeaders,
      requestData.omitHeaders,
    ),
    body: requestData.body ? JSON.stringify(requestData.body) : undefined,
  };
  return new Request(`${baseURL}${requestData.url}`, reqInit);
};

export const buildHeaders = (
  cfg: ClientConfig,
  token?: string,
  userAgent: string = "unknown",
  additionalHeaders?: Record<string, string>,
  omitHeaders: OmitHeaders = [],
): Record<string, string> => {
  const defaultHeaders: DefaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token || ""}`,
    "User-Agent": userAgent,
    "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
    "Merchant-Serial-Number": cfg.merchantSerialNumber,
    "Vipps-System-Name": cfg.systemName || "",
    "Vipps-System-Version": cfg.systemVersion || "",
    "Vipps-System-Plugin-Name": cfg.pluginName || "",
    "Vipps-System-Plugin-Version": cfg.pluginVersion || "",
    "Idempotency-Key": uuid.generate(),
  };

  const combinedHeaders: Record<string, string> = {
    ...additionalHeaders,
    ...defaultHeaders,
  };

  if (omitHeaders.length === 0) {
    return combinedHeaders;
  }
  return filterHeaders(combinedHeaders, omitHeaders);
};

export const filterHeaders = (
  headers: Record<string, string>,
  omitHeaders: string[],
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(headers).filter(([key]) => !omitHeaders.includes(key)),
  );
};

export const getUserAgent = (
  version: string,
  moduleURL: string | undefined,
): string => {
  if (!moduleURL) {
    return `Vipps/Deno-SDK/npm-require/${version}`;
  }

  return `Vipps/Deno-SDK/${getModuleSource(moduleURL)}/${version}`;
};

export const getModuleSource = (moduleUrl: string): string => {
  const url = new URL(moduleUrl);

  switch (true) {
    case url.pathname.includes("node_modules"):
      return "npm-module";
    case url.host === "npm.jsr.io":
      return "jsr-npm";
    case url.host === "jsr.io":
      return "jsr";
    case url.host === "deno.land":
      return "deno-land";
    default:
      return "unknown";
  }
};

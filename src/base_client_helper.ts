import { isErrorStatus, retry } from "./deps.ts";
import { parseError } from "./errors.ts";
import { ClientConfig, ClientResponse, RequestData } from "./types.ts";

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

export const buildRequest = (
  cfg: ClientConfig,
  requestData: RequestData<unknown, unknown>,
): Request => {
  const baseURL = cfg.useTestMode
    ? "https://apitest.vipps.no"
    : "https://api.vipps.no";

  const reqInit: RequestInit = {
    method: requestData.method,
    headers: {
      ...requestData.headers,
      ...{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${requestData.token}` || "",
        "User-Agent": createUserAgent(import.meta.url),
        "Ocp-Apim-Subscription-Key": cfg.subscriptionKey,
        "Merchant-Serial-Number": cfg.merchantSerialNumber,
        "Vipps-System-Name": cfg.systemName || "acme-systems",
        "Vipps-System-Version": cfg.systemVersion || "1.0.0",
        "Vipps-System-Plugin-Name": cfg.pluginName || "acme-plugin",
        "Vipps-System-Plugin-Version": cfg.pluginVersion || "1.0.0",
        "Idempotency-Key": crypto.randomUUID(),
      },
    },
    body: requestData.body ? JSON.stringify(requestData.body) : undefined,
  };
  return new Request(`${baseURL}${requestData.url}`, reqInit);
};

// Function that should receive import.meta.url (that will returns the URL of the current module
// See: https://docs.deno.com/runtime/manual/runtime/import_meta_api
export const createUserAgent = (metaUrl: string): string => {
  let userAgent = "Vipps/Deno SDK/";

  // Check if module is loaded from deno.land/x
  const fromDenoLand = metaUrl.includes(
    "https://deno.land/x/vipps_mobilepay_sdk",
  );

  if (fromDenoLand) {
    // Extract the module version from the URL
    const sdkVersion = metaUrl.split("@")[1].split("/")[0];
    userAgent += sdkVersion;
  } else {
    // If not loaded from deno.land/x, assume it's a local version
    userAgent += "local";
  }

  return userAgent;
};

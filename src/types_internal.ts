import { SDKError } from "./types_external.ts";

export type ClientResponse<TOk, TErr> =
  | {
    ok: true;
    data: TOk;
  }
  | SDKError<TErr>;

export type BaseClient = {
  readonly makeRequest: (
    requestData: RequestData<unknown, unknown>,
  ) => Promise<ClientResponse<unknown, unknown>>;
};

export type RequestFactory = {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => RequestData<unknown, unknown>;
};

export type ApiProxy<TFac extends RequestFactory> = {
  [key in keyof TFac]: TFac[key] extends (
    ...args: infer TArgs
  ) => RequestData<infer TOk, infer TErr>
    ? (...args: TArgs) => Promise<ClientResponse<TOk, TErr>>
    : never;
};

export type RequestData<TOk, TErr> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  additionalHeaders?: Record<string, string>;
  omitHeaders?: OmitHeaders;
  body?: unknown;
  token?: string;
};

export type DefaultHeaders = {
  "Content-Type": "application/json";
  "Authorization": string;
  "User-Agent": string;
  "Ocp-Apim-Subscription-Key": string;
  "Merchant-Serial-Number": string;
  "Vipps-System-Name": string;
  "Vipps-System-Version": string;
  "Vipps-System-Plugin-Name": string;
  "Vipps-System-Plugin-Version": string;
  "Idempotency-Key": string;
};

export type OmitHeaders = (keyof DefaultHeaders)[];

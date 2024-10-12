import type { ClientConfig, SDKError } from "./types_external.ts";

/**
 * Represents a response from the client.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error details.
 */
export type ClientResponse<TOk, TErr> =
  | {
    ok: true;
    data: TOk;
  }
  | (SDKError<TErr> & { retry?: boolean });

/**
 * Represents the base client with a method to make requests.
 */
export type BaseClient = {
  readonly makeRequest: (
    requestData: RequestData<unknown, unknown>,
  ) => Promise<ClientResponse<unknown, unknown>>;
};

export type InternalConfig = ClientConfig & { version: string };

/**
 * Represents a factory for creating request data.
 */
export type RequestFactory = {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => RequestData<unknown, unknown>;
};

/**
 * Represents a proxy for API requests.
 *
 * This type transforms a `RequestFactory` type into a type where each method
 * returns a `Promise` that resolves to a `ClientResponse`.
 *
 * @template TFac - The type of the request factory.
 */
export type ApiProxy<TFac extends RequestFactory> = {
  [key in keyof TFac]: TFac[key] extends (
    ...args: infer TArgs
  ) => RequestData<infer TOk, infer TErr>
    ? (...args: TArgs) => Promise<ClientResponse<TOk, TErr>>
    : never;
};

/**
 * Represents the data required to make a request.
 *
 * @template TOk - The type of the successful response data.
 * @template TErr - The type of the error details.
 */
export type RequestData<TOk, TErr> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  additionalHeaders?: Record<string, string>;
  omitHeaders?: OmitHeaders;
  body?: unknown;
  token?: string;
};

/**
 * Represents the default headers used in requests.
 */
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

/**
 * Represents an array of keys from the DefaultHeaders type that should be omitted.
 *
 * @example
 * const headersToOmit: OmitHeaders = ["Authorization", "Content-Type"];
 */
export type OmitHeaders = (keyof DefaultHeaders)[];

/**
 * A utility type that makes the type `T` more readable by flattening its structure.
 *
 * @template T - The type to prettify.
 */
export type PrettifyType<T> = { [K in keyof T]: T[K] } & unknown;

/**
 * A utility type that makes the specified property `K` of type `T` optional.
 *
 * @template T - The type containing the property to make optional.
 * @template K - The key of the property to make optional.
 */
export type MakePropertyOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]?: T[P] };

/**
 * A utility type that makes the specified nested property `N` of type `T[K]` optional.
 *
 * @template T - The type containing the nested property to make optional.
 * @template K - The key of the property containing the nested property.
 * @template N - The key of the nested property to make optional.
 */
export type MakeNestedPropertyOptional<
  T,
  K extends keyof T,
  N extends keyof T[K],
> = {
  [P in keyof T]: P extends K ? Omit<T[K], N> & Partial<Pick<T[K], N>> : T[P];
};

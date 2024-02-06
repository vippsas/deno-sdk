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

export type ClientResponse<TOk, TErr> =
  | {
    ok: true;
    data: TOk;
  }
  | SDKError<TErr>;

export type SDKError<TErr> = {
  ok: false;
  error: TErr | { message: string };
};

export type ClientConfig = {
  subscriptionKey: OcpApimSubscriptionKey;
  merchantSerialNumber: MerchantSerialNumber;
  /** Example: "My Ecommerce System" */
  systemName?: string;
  /** Example: "1.0.0" */
  systemVersion?: string;
  /** Example: "My cool plugin" */
  pluginName?: string;
  /** Example: "1.0.0" */
  pluginVersion?: string;
  /** If true, uses Vipps test environment. @default false */
  useTestMode?: boolean;
  /** If true retries requests 2 times. @default true */
  retryRequests?: boolean;
};

export type DefaultHeaders = {
  "Content-Type": "application/json";
  "Authorization": string;
  "User-Agent": string;
  "Ocp-Apim-Subscription-Key": OcpApimSubscriptionKey;
  "Merchant-Serial-Number": MerchantSerialNumber;
  /**
   * The name of the ecommerce solution. Example: "Acme Commerce".
   *
   * @maxLength 30
   */
  "Vipps-System-Name": string;
  /**
   * The version number of the ecommerce solution. Example: "3.1.2"..
   *
   * @maxLength 30
   */
  "Vipps-System-Version": string;
  /**
   * The name of the ecommerce plugin. Example: "acme-webshop".
   *
   * @maxLength 30
   */
  "Vipps-System-Plugin-Name": string;
  /**
   * The version number of the ecommerce plugin. Example: "4.5.6".
   *
   * @maxLength 30
   */
  "Vipps-System-Plugin-Version": string;
  "Idempotency-Key": string;
};

export type OmitHeaders = (keyof DefaultHeaders)[];

/**
 * The merchant serial number (MSN) for the sales unit.
 * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
 *
 * @minLength 4
 * @maxLength 6
 * @pattern ^[0-9]{4,6}$
 * @example "123456"
 */
export type MerchantSerialNumber = string;

/**
 * Vipps Subscription key for the API product.
 * See [API keys](https://developer.vippsmobilepay.com/docs/knowledge-base/api-keys/).
 *
 * @minLength 1
 * @example "0f14ebcab0eb4b29ae0cb90d91b4a84a"
 */
export type OcpApimSubscriptionKey = string;

export type BaseClient = {
  readonly makeRequest: (
    requestData: RequestData<unknown, unknown>,
  ) => Promise<ClientResponse<unknown, unknown>>;
};
export type ClientResponse<TOk, TErr> =
  | {
    ok: true;
    data: TOk;
  }
  | {
    ok: false;
    message: string;
    error?: TErr;
  };

export type ClientConfig = {
  /** Vipps Subscription key for the API product. Found in the Vipps portal.
   * Example: "0f14ebcab0eb4b29ae0cb90d91b4a84a". */
  subscriptionKey: string;
  /** Vipps assigned unique number for a merchant. Found in the Vipps portal.
   * Example: "123456". */
  merchantSerialNumber: string;
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

export type Credentials = {
  /** Client ID for the merchant (the "username"). Found in the Vipps portal.
   * Example: "fb492b5e-7907-4d83-bc20-c7fb60ca35de". */
  clientId: string;
  /** Client Secret for the merchant (the "password"). Found in the Vipps portal.
   * Example: "Y8Kteew6GE3ZmeycEt6egg==" */
  clientSecret: string;
} & Pick<ClientConfig, "subscriptionKey">;

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

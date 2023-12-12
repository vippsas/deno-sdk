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

export type RequestData<TOk, TErr> = {
  method: string;
  url: string;
  headers?: HeadersInit;
  body?: unknown;
  token?: string;
};

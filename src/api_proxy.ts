import { BaseClient, ClientResponse, RequestData } from "./types.ts";

export type APIClient = {
  [key: string]: ApiProxy<RequestFactory>;
};

type RequestFactory = {
  [name: string]: (...args: never[]) => RequestData<unknown, unknown>;
};

type ApiProxy<TFac extends RequestFactory> = {
  [key in keyof TFac]: TFac[key] extends (
    ...args: infer TArgs
  ) => RequestData<infer TOk, infer TErr>
    ? (...args: TArgs) => Promise<ClientResponse<TOk, TErr>>
    : never;
};

export const createApi = <T extends RequestFactory>(
  baseClient: BaseClient,
  factory: T,
) => {
  return new Proxy(factory, {
    get(factory: T, prop) {
      if (typeof prop === "string" && prop in factory) {
        return (...args: Parameters<T[keyof T]>) => {
          const requestData = factory[prop](...args);
          return baseClient.makeRequest(requestData);
        };
      }
      throw new Error(`Method ${String(prop)} does not exist in the factory.`);
    },
  }) as unknown as ApiProxy<T>;
};

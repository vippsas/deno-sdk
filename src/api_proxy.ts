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

/**
 * Creates an API proxy object that wraps a request factory and makes requests using a base client.
 * @param baseClient The base client used to make requests.
 * @param factory The request factory object.
 * @returns An API proxy object.
 */
export const createApi = <T extends RequestFactory>(
  baseClient: BaseClient,
  factory: T,
) => {
  return new Proxy(factory, {
    // Intercept property access, e.g. client.payment.create
    get(factory: T, prop) {
      // Check if the property exists in the factory
      if (typeof prop === "string" && prop in factory) {
        // Return a function that makes a request using the base client
        return (...args: Parameters<T[keyof T]>) => {
          const requestData = factory[prop](...args);
          // Make the request using the base client
          return baseClient.makeRequest(requestData);
        };
      }
      throw new Error(`Method ${String(prop)} does not exist in the factory.`);
    },
  }) as unknown as ApiProxy<T>;
};

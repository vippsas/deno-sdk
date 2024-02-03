import { BaseClient, ClientResponse, RequestData } from "./types.ts";

export type ApiClient = {
  [key: string]: ApiProxy<RequestFactory> | ApiClient;
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
 *
 * @param baseClient The base client used to make requests.
 * @param factory The request factory object.
 */
export const createApi = <TFac extends RequestFactory>(
  client: BaseClient,
  factory: TFac,
) => {
  return new Proxy(factory, {
    get(target, prop, receiver) {
      if (Reflect.ownKeys(target).includes(prop)) {
        // Return a function that makes a request using the base client
        return (...args: Parameters<TFac[keyof TFac]>) => {
          const requestData = Reflect.get(target, prop, receiver)(...args);
          return client.makeRequest(requestData);
        };
      }
    },
  }) as unknown as ApiProxy<TFac>;
};

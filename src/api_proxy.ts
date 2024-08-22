import { ApiProxy, BaseClient, RequestFactory } from "./types.ts";

/**
 * Creates an API proxy object that wraps a request factory, then intercepts
 * the calls to the factory methods and makes requests using a base client.
 *
 * @template TFac - The type of the request factory.
 * @param {BaseClient} client - The base client used to make requests.
 * @param {TFac} factory - The request factory object to wrap.
 * @returns {ApiProxy<TFac>} The proxified API object.
 */
export const proxifyFactory = <TFac extends RequestFactory>(
  client: BaseClient,
  factory: TFac,
): ApiProxy<TFac> => {
  return new Proxy(factory, {
    get(fac, prop) {
      const originalMethod = Reflect.get(fac, prop);
      if (typeof originalMethod !== "function") {
        return originalMethod; // Fallback to the original object
      }
      return new Proxy(originalMethod, {
        apply(facFn, _this, args) {
          return client.makeRequest(facFn(...args));
        },
      });
    },
  }) as unknown as ApiProxy<TFac>;
};

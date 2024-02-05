import { ApiProxy, BaseClient, RequestFactory } from "./types.ts";

/**
 * Creates an API proxy object that wraps a request factory, then intercepts
 * the calls to the factory methods and makes requests using a base client.
 *
 * @param baseClient The base client used to make requests.
 * @param factory The request factory object to wrap.
 */
export const proxifyFactory = <TFac extends RequestFactory>(
  client: BaseClient,
  factory: TFac,
) => {
  return new Proxy(factory, {
    get(fac, prop) {
      if (typeof Reflect.get(fac, prop) !== "function") {
        return Reflect.get(fac, prop); // Fallback to the original object
      }
      return new Proxy(Reflect.get(fac, prop), {
        apply(facFn, _this, args: Parameters<TFac[keyof TFac]>) {
          return client.makeRequest(facFn(...args));
        },
      });
    },
  }) as unknown as ApiProxy<TFac>;
};

import { authRequestFactory } from "./apis/auth.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import type { ApiProxy, BaseClient, RequestFactory } from "./types.ts";

export type SDKClient = {
  auth: ReturnType<typeof proxifyFactory<typeof authRequestFactory>>;
  payment: ReturnType<typeof proxifyFactory<typeof ePaymentRequestFactory>>;
  webhook: ReturnType<typeof proxifyFactory<typeof webhooksRequestFactory>>;
};

/**
 * Proxifies the base client with the API request factories.
 *
 * @param {BaseClient} client - The base client to proxify.
 */
export const proxifyClient = (client: BaseClient): SDKClient => {
  return {
    auth: proxifyFactory(client, authRequestFactory),
    payment: proxifyFactory(client, ePaymentRequestFactory),
    webhook: proxifyFactory(client, webhooksRequestFactory),
  } as const;
};

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

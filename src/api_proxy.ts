import { authRequestFactory } from "./apis/auth.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import {
  agreementRequestFactory,
  chargeRequestFactory,
} from "./apis/recurring.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import type { ApiProxy, BaseClient, RequestFactory } from "./types_internal.ts";

export type SDKClient = {
  auth: ReturnType<typeof proxifyFactory<typeof authRequestFactory>>;
  checkout: ReturnType<typeof proxifyFactory<typeof checkoutRequestFactory>>;
  payment: ReturnType<typeof proxifyFactory<typeof ePaymentRequestFactory>>;
  recurring: {
    agreement: ReturnType<
      typeof proxifyFactory<typeof agreementRequestFactory>
    >;
    charge: ReturnType<typeof proxifyFactory<typeof chargeRequestFactory>>;
  };
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
    checkout: proxifyFactory(client, checkoutRequestFactory),
    payment: proxifyFactory(client, ePaymentRequestFactory),
    recurring: {
      charge: proxifyFactory(client, chargeRequestFactory),
      agreement: proxifyFactory(client, agreementRequestFactory),
    },
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

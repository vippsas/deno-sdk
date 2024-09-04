import { authRequestFactory } from "./apis/auth.ts";
import { checkoutRequestFactory } from "./apis/checkout.ts";
import { ePaymentRequestFactory } from "./apis/epayment.ts";
import { loginRequestFactory } from "./apis/login.ts";
import { orderManagementRequestFactory } from "./apis/ordermanagement.ts";
import {
  callbackQRRequestFactory,
  redirectQRRequestFactory,
} from "./apis/qr.ts";
import {
  agreementRequestFactory,
  chargeRequestFactory,
} from "./apis/recurring.ts";
import { userRequestFactory } from "./apis/user.ts";
import { webhooksRequestFactory } from "./apis/webhooks.ts";
import type { ApiProxy, BaseClient, RequestFactory } from "./types.ts";

export type SDKClient = {
  auth: ReturnType<typeof proxifyFactory<typeof authRequestFactory>>;
  checkout: ReturnType<typeof proxifyFactory<typeof checkoutRequestFactory>>;
  login: ReturnType<typeof proxifyFactory<typeof loginRequestFactory>>;
  order: ReturnType<
    typeof proxifyFactory<typeof orderManagementRequestFactory>
  >;
  payment: ReturnType<typeof proxifyFactory<typeof ePaymentRequestFactory>>;
  qr: {
    callback: ReturnType<
      typeof proxifyFactory<typeof callbackQRRequestFactory>
    >;
    redirect: ReturnType<
      typeof proxifyFactory<typeof redirectQRRequestFactory>
    >;
  };
  recurring: {
    charge: ReturnType<typeof proxifyFactory<typeof chargeRequestFactory>>;
    agreement: ReturnType<
      typeof proxifyFactory<typeof agreementRequestFactory>
    >;
  };
  user: ReturnType<typeof proxifyFactory<typeof userRequestFactory>>;
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
    login: proxifyFactory(client, loginRequestFactory),
    order: proxifyFactory(client, orderManagementRequestFactory),
    payment: proxifyFactory(client, ePaymentRequestFactory),
    qr: {
      callback: proxifyFactory(client, callbackQRRequestFactory),
      redirect: proxifyFactory(client, redirectQRRequestFactory),
    },
    recurring: {
      charge: proxifyFactory(client, chargeRequestFactory),
      agreement: proxifyFactory(client, agreementRequestFactory),
    },
    user: proxifyFactory(client, userRequestFactory),
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

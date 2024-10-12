import { baseClient } from "./base_client.ts";
import { proxifyClient, type SDKClient } from "./api_proxy.ts";
import type { ClientConfig } from "./types_external.ts";

// Export all API types, for convenience.
export type * from "./types_external.ts";

/**
 * Creates a new SDK client.
 *
 * @param options - The client configuration options.
 * @returns {SDKClient} The SDK client.
 *
 * @example Usage
 * ```ts
 * const client = Client({
 *   merchantSerialNumber = "123456",
 *   subscriptionKey = "94g4f68f3ddb20a0b1j23319b854381m",
 *   useTestMode: true,
 *   retryRequests: true,
 * });
 * ```
 */
export const Client = (options: ClientConfig): SDKClient => {
  // Add the SDK version to the client configuration
  const version = "1.0.0";

  // Create the base client
  const client = baseClient({ ...options, version }); // Add version information to the client configuration

  // Proxify the base client with the API request factories
  return proxifyClient(client);
};

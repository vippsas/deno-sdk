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
 * @returns {SDKClient} The SDK client.
 */
export const Client = (options: ClientConfig): SDKClient => {
  // Create the base client
  const client = baseClient(options);

  // Proxify the base client with the API request factories
  return proxifyClient(client);
};

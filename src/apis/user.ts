import { RequestData } from "../types.ts";

/**
 * Factory object for creating Userinfo API requests.
 */
export const userRequestFactory = {
  info(): RequestData<unknown, unknown> {
    return {
      url: `/user...`,
      method: "GET",
    };
  },
} as const;

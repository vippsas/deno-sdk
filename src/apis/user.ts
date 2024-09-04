import type { RequestData } from "../types.ts";
import type { UserInfo, UserInfoError } from "./types/user_types.ts";

/**
 * Factory object for creating Userinfo API requests.
 */
export const userRequestFactory = {
  /**
   * Retrieves information that a user has consented to share.
   *
   * @param token - The authentication token.
   * @param sub - The sub claim of the user.
   * @returns A `UserInfo` or `UserInfoError` object.
   */
  info: (token: string, sub: string): RequestData<UserInfo, UserInfoError> => {
    return {
      url: `/vipps-userinfo-api/userinfo/${sub}`,
      method: "GET",
      token,
    };
  },
};

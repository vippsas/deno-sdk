import { RequestData } from "../types.ts";
import { UserInfo, UserInfoError } from "./types/user_types.ts";

/**
 * Factory object for creating Userinfo API requests.
 */
export const userRequestFactory = {
  info(sub: string): RequestData<UserInfo, UserInfoError> {
    return {
      url: `/vipps-userinfo-api/userinfo/${sub}`,
      method: "GET",
    };
  },
} as const;

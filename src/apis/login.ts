import type { RequestData } from "../types.ts";
import type {
  LoginErrorResponse,
  LoginWellKnownResponse,
} from "./types/login_types.ts";

/**
 * Factory object for creating Login API requests.
 */
export const loginRequestFactory = {
  /**
   * The well-known endpoint can be used to retrieve configuration
   * information for OpenID Connect clients. To learn more about this
   * endpoint, please refer to the specification at
   * https://openid.net/specs/openid-connect-discovery-1_0.html
   *
   * @returns A `LoginWellKnownResponse` or `LoginErrorResponse` object.
   */
  discovery: (): RequestData<LoginWellKnownResponse, LoginErrorResponse> => {
    return {
      url: `/access-management-1.0/access/.well-known/openid-configuration`,
      method: "GET",
      omitHeaders: ["Ocp-Apim-Subscription-Key"],
    };
  },
};

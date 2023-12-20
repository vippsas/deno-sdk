import { Credentials, RequestData } from "../types.ts";
import { AccessToken, AccessTokenError } from "./types/auth_types.ts";

/**
 * Factory for creating authentication-related request data.
 */
export const authRequestFactory = {
  /**
   * This is an authentication endpoint for merchant use. The access token
   * endpoint is used to get the JWT (JSON Web Token) that must be passed in
   * every API request in the Authorization header. The access token is a
   * base64-encoded string value that must be acquired first before making
   * any Vipps MobilePay API calls. The access token is valid for 1 hour in
   * the test environment and 24 hours in the production environment.
   * See: https://developer.vippsmobilepay.com/docs/APIs/access-token-api/
   *
   * @param cred - The credentials.
   * @returns The request data.
   */
  getToken(cred: Credentials): RequestData<AccessToken, AccessTokenError> {
    return {
      method: "POST",
      url: "/accesstoken/get",
      headers: {
        "client_id": cred.clientId,
        "client_secret": cred.clientSecret,
        "Ocp-Apim-Subscription-Key": cred.subscriptionKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  },
} as const;

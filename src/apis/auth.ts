import type { RequestData } from "../types_internal.ts";
import type {
  AccessTokenError,
  AuthorizationTokenResponse,
} from "../types_external.ts";

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
   * @param clientId Client ID for the merchant (the "username").
   * Found in the Vipps portal. Example: "fb492b5e-7907-4d83-bc20-c7fb60ca35de".
   * @param clientSecret Client Secret for the merchant (the "password").
   * Found in the Vipps portal. Example: "Y8Kteew6GE3ZmeycEt6egg=="
   * @returns A `AccessToken` or `AccessTokenError` object.
   */
  getToken: (
    clientId: string,
    clientSecret: string,
  ): RequestData<AuthorizationTokenResponse, AccessTokenError> => {
    return {
      method: "POST",
      url: "/accesstoken/get",
      additionalHeaders: {
        "client_id": clientId,
        "client_secret": clientSecret,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  },
};

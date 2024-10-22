// This file is auto-generated by @hey-api/openapi-ts

/**
 * This _new_ accesstoken endpoint is used to get the JWT (JSON Web Token) that
 * must be passed in every API request in the `Authorization` header.
 * The access token is a base64-encoded string value that must be
 * acquired first before making any Vipps MobilePay API calls.
 * The access token is valid for 15 minutes both in the test environment
 * and in the production environment.
 * See: https://developer.vippsmobilepay.com/docs/APIs/access-token-api/
 */
export type TokenResponse = {
  /**
   * The type for the access token.
   * This will always be `Bearer`.
   */
  token_type: string;
  /**
   * Token expiry time in seconds. The token is currently valid for 15 minutes.
   */
  expires_in: string;
  /**
   * The access token itself, typically 1000+ characters.
   */
  access_token: string;
};

export type AuthorizationTokenResponse = {
  /**
   * The type for the access token.
   * This will always be `Bearer`.
   */
  token_type: string;
  /**
   * Token expiry time in seconds.
   * The access token is valid for 1 hour in the test environment
   * and 24 hours in the production environment.
   */
  expires_in: string;
  /**
   * Extra time added to expiry time. Currently disabled.
   */
  ext_expires_in: string;
  /**
   * Token expiry time in epoch time format.
   */
  expires_on: string;
  /**
   * Token creation time in epoch time format.
   */
  not_before: string;
  /**
   * A common resource object.
   * Not used in token validation.
   * This can be disregarded.
   */
  resource: string;
  /**
   * The access token itself.
   * It is a base64-encoded string, typically 1000+ characters.
   * It can be decoded on https://jwt.io, and using standard libraries.
   * See the documentation for details.
   */
  access_token: string;
};

/**
 * The merchant serial number (MSN) for the sales unit. The Merchant-Serial-Number header
 * can be used with all API keys, and can speed up any trouble-shooting of API
 * problems quite a bit.
 */
export type ParameterMerchant_Serial_Number = string;

/**
 * The subscription key for a sales unit. See [API keys](/docs/knowledge-base/api-keys/).
 */
export type ParameterOcp_Apim_Subscription_Key = string;

/**
 * The name of the ecommerce solution.
 * One word in lowercase letters is good.
 * See [http-headers](/docs/knowledge-base/http-headers).
 */
export type ParameterVipps_System_Name = string;

/**
 * The version number of the ecommerce solution.
 * See [http-headers](/docs/knowledge-base/http-headers).
 */
export type ParameterVipps_System_Version = string;

/**
 * The name of the ecommerce plugin (if applicable).
 * One word in lowercase letters is good.
 * See [http-headers](/docs/knowledge-base/http-headers).
 */
export type ParameterVipps_System_Plugin_Name = string;

/**
 * The version number of the ecommerce plugin (if applicable).
 * See [http-headers](/docs/knowledge-base/http-headers).
 */
export type ParameterVipps_System_Plugin_Version = string;

export type FetchAuthorizationTokenUsingPostData = {
  headers: {
    /**
     * The `client_id` is available on portal.vippsmobilepay.com, under the *Developer* section.
     * Think of it as the "username".
     */
    client_id: string;
    /**
     * The `client_secret` is available on portal.vippsmobilepay.com, under the *Developer* section.
     * Think of it as the "password".
     * Keep it secret.
     * We will never ask for it, and we don't need it for anything.
     */
    client_secret: string;
    /**
     * The merchant serial number (MSN) for the sales unit. The Merchant-Serial-Number header
     * can be used with all API keys, and can speed up any trouble-shooting of API
     * problems quite a bit.
     */
    "Merchant-Serial-Number"?: string;
    /**
     * The subscription key for a sales unit. See [API keys](/docs/knowledge-base/api-keys/).
     */
    "Ocp-Apim-Subscription-Key": string;
    /**
     * The name of the ecommerce solution.
     * One word in lowercase letters is good.
     * See [http-headers](/docs/knowledge-base/http-headers).
     */
    "Vipps-System-Name"?: string;
    /**
     * The name of the ecommerce plugin (if applicable).
     * One word in lowercase letters is good.
     * See [http-headers](/docs/knowledge-base/http-headers).
     */
    "Vipps-System-Plugin-Name"?: string;
    /**
     * The version number of the ecommerce plugin (if applicable).
     * See [http-headers](/docs/knowledge-base/http-headers).
     */
    "Vipps-System-Plugin-Version"?: string;
    /**
     * The version number of the ecommerce solution.
     * See [http-headers](/docs/knowledge-base/http-headers).
     */
    "Vipps-System-Version"?: string;
  };
};

export type FetchAuthorizationTokenUsingPostResponse =
  AuthorizationTokenResponse;

export type FetchAuthorizationTokenUsingPostError = unknown;

export type FetchTokenData = {
  body: {
    grant_type?: "client_credentials";
  };
  headers: {
    /**
     * The string 'client_id:client_secret' encoded to Base64 with Basic in front
     */
    Authorization: string;
  };
};

export type FetchTokenResponse = TokenResponse;

export type FetchTokenError = unknown;

export type $OpenApiTs = {
  "/accesstoken/get": {
    post: {
      req: FetchAuthorizationTokenUsingPostData;
      res: {
        /**
         * OK
         */
        "200": AuthorizationTokenResponse;
        /**
         * Bad request
         */
        "400": unknown;
        /**
         * Unauthorized
         */
        "401": unknown;
        /**
         * Server error.
         */
        "500": unknown;
      };
    };
  };
  "/miami/v1/token": {
    post: {
      req: FetchTokenData;
      res: {
        /**
         * OK
         */
        "200": TokenResponse;
        /**
         * Bad request
         */
        "400": unknown;
        /**
         * Unauthorized
         */
        "401": unknown;
        /**
         * Server error.
         */
        "500": unknown;
      };
    };
  };
};

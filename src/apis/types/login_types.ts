import { Scope } from "./shared_types.ts";

export type LoginAuthQueryParams = {
  /** Value MUST be set to "code". */
  response_type: "code";
  /** The client identifier, issued by Vipps MobilePay. */
  client_id: string;
  /**
   * Redirect URL which the user agent is redirected to after finishing a
   * login. If the URL is using a custom URL scheme, such as myapp://,
   * a path is required: myapp://path-to-something.
   */
  redirect_uri: string;
  /**
   * Scope of the access request, space-separated list.
   *
   * Valid scopes are: Name, Adresse, Delegated Consents, Email
   * National identity number, Birth date, Promotions, Phone number
   *
   * @example "openid name phoneNumber address birthDate email"
   */
  scope: Scope;
  /**
   * An opaque value (e.g. a GUID) used by the client to maintain state
   * between the request and callback. The authorization server includes
   * this value when redirecting the user-agent back to the client.
   * It must be at least 8 characters long to ensure sufficient entropy.
   * In case of a too short state parameter the end-user will be
   * redirected back to the merchant's site with an error.
   *
   * @example "5f6ddc4d-9c5b-4a9f-9aef-9cb4ef9b9a9d"
   */
  state: string;
  /** Request a specific flow for the user. */
  requested_flow?: string;
  /**
   * The target URI for automatic switch back to merchant app.
   * Requires requested_flow=app_to_app. Example merchant-app://callback
   */
  app_callback_uri?: string;
  /**
   * Either true or false. If this is true we will enable some
   * compatibility features to make sure the user is returned to the app.
   */
  final_redirect_is_app?: boolean;
  /**
   * Used for PKCE, either S256 or plain.
   *
   * @default "plain"
   */
  code_challenge_method?: "S256" | "plain";
  /**
   * Used for PKCE. The value must be calculated based on the
   * code_verifier later used towards the token endpoint
   */
  code_challenge?: string;
};

/**
 * WellKnown Response
 * It includes links to several endpoints (e.g. /oauth2/token) and
 * exposes information on supported signature algorithms among others.
 */
export type LoginWellKnownResponse = {
  /**
   * URL of the OP's OAuth 2.0 Authorization Endpoint.
   *
   * @example "https://api.vipps.no/access-management-1.0/access/oauth2/auth"
   */
  authorization_endpoint: string;
  /**
   * Boolean value specifying whether the OP supports use of the claims
   * parameter, with true indicating support.
   *
   * @example false
   */
  claims_parameter_supported?: boolean;
  /**
   * JSON array containing a list of the Claim Names of the Claims that the
   * OpenID Provider MAY be able to supply values for.
   * Note that for privacy or other reasons, this might not be an exhaustive list.
   */
  claims_supported?: string[];
  /**
   * JSON array containing a list of the OAuth 2.0 Grant
   * Type values that this OP supports.
   */
  grant_types_supported?: string[];
  /**
   * JSON array containing a list of the JWS signing algorithms (alg values)
   * supported by the OP for the ID Token to encode the Claims in a JWT.
   */
  id_token_signing_alg_values_supported: string[];
  /**
   * URL using the https scheme with no query or fragment component that the OP
   * asserts as its IssuerURL Identifier.
   *
   * If IssuerURL discovery is supported, this value MUST be identical to the
   * issuer value returned by WebFinger.
   *
   * This also MUST be identical to the iss Claim value in ID Tokens issued
   * from this IssuerURL.
   *
   * @example "https://apitest.vipps.no/access-management-1.0/access/"
   */
  issuer: string;
  /**
   * URL of the OP's JSON Web Key Set [JWK] document.
   *
   * This contains the signing key(s) the RP uses to validate signatures from
   * the OP. The JWK Set MAY also contain the Server's encryption key(s),
   * which are used by RPs to encrypt requests to the Server.
   *
   * When both signing and encryption keys are made available, a use (Key Use)
   * parameter value is REQUIRED for all keys in the referenced JWK Set to
   * indicate each key's intended usage.
   *
   * Although some algorithms allow the same key to be used for both signatures
   * and encryption, doing so is NOT RECOMMENDED, as it is less secure.
   *
   * The JWK x5c parameter MAY be used to provide X.509 representations of keys
   * provided. When used, the bare key values MUST still be present and MUST
   * match those in the certificate.
   *
   * @example "https://apitest.vipps.no/access-management-1.0/access/.well-known/jwks.json"
   */
  jwks_uri: string;
  /**
   * Boolean value specifying whether the OP supports use of the request
   * parameter, with true indicating support.
   *
   * @example true
   */
  request_parameter_supported?: boolean;
  /**
   * Boolean value specifying whether the OP supports use of the
   * request_uri parameter, with true indicating support.
   *
   * @example true
   */
  request_uri_parameter_supported?: boolean;
  /**
   * Boolean value specifying whether the OP requires any request_uri values
   * used to be pre-registered using the request_uris registration parameter.
   *
   * @example true
   */
  require_request_uri_registration?: boolean;
  /**
   * JSON array containing a list of the OAuth 2.0 response_mode
   * values that this OP supports.
   */
  response_modes_supported?: string[];
  /**
   * JSON array containing a list of the OAuth 2.0 response_type
   * values that this OP supports.
   */
  response_types_supported: string[];
  /**
   * JSON array containing a list of the OAuth 2.0 [RFC6749]
   * scope values that this server supports.
   * The server MUST support the openid scope value.
   * Servers MAY choose not to advertise some supported
   * scope values even when this parameter is used.
   */
  scopes_supported?: string[];
  /**
   * JSON array containing a list of the Subject Identifier
   * types that this OP supports.
   * Valid types include pairwise and public.
   */
  subject_types_supported: string[];
  /** URL of the OP's OAuth 2.0 Token Endpoint */
  token_endpoint: string;
  /**
   * JSON array containing a list of Client Authentication methods
   * supported by this Token Endpoint.
   * The options are client_secret_post, client_secret_basic,
   * client_secret_jwt, and private_key_jwt,
   * as described in Section 9 of OpenID Connect Core 1.0
   */
  token_endpoint_auth_methods_supported?: string[];
};

/**
 * ErrorResponse
 * Error responses are sent when an error (e.g. unauthorized,
 * bad request, etc) occurred.
 *
 * @example {"error":"invalid_request","error_code":400,
 * "error_debug":"The request is missing a required parameter,
 * includes an invalid parameter or is otherwise malformed."}
 */
export type LoginErrorResponse = {
  /** Name is the error name. */
  error: string;
  /**
   * Code represents the error status code (404, 403, 401, ...).
   *
   * @format int64
   */
  error_code?: number;
  /** Debug contains debug information.
   * This is usually not available and has to be enabled. */
  error_debug?: string;
};

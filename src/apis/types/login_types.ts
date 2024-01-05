export type LoginAuthQueryParams = {
  /** Value MUST be set to "code". */
  response_type: "code";
  /** The client identifier, issued by Vipps MobilePay. */
  client_id: string;
  /** Redirect URL which the user agent is redirected to after finishing a
   * login. If the URL is using a custom URL scheme, such as myapp://,
   * a path is required: myapp://path-to-something. */
  redirect_uri: string;
  /**
   * Scope of the access request, space-separated list.
   *
   * Valid scopes are: Name, Adresse, Delegated Consents, Email
   * National identity number, Birth date, Promotions, Phone number
   *
   * @example "openid name phoneNumber address birthDate email"
   */
  scope: string;
  /** An opaque value (e.g. a GUID) used by the client to maintain state
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
   * @default "plain"
   */
  code_challenge_method?: "S256" | "plain";
  /**
   * Used for PKCE. The value must be calculated based on the
   * code_verifier later used towards the token endpoint
   */
  code_challenge?: string;
};

export type LoginJSONWebKey = {
  /**
   * The 'alg' (algorithm) parameter identifies the algorithm intended for use for the key.  The values used should either be registered in the IANA 'JSON Web Signature and Encryption Algorithms' registry established by [JWA] or be a value that contains a collision resistant name.
   * @example "RS256"
   */
  alg: string;
  /** @example "P-256" */
  crv?: string;
  /** @example "T_N8I-6He3M8a7X1vWt6TGIx4xB_GP3Mb4SsZSA4v-orvJzzRiQhLlRR81naWYxfQAYt5isDI6_C2L9bdWo4FFPjGQFvNoRX-_sBJyBI_rl-TBgsZYoUlAj3J92WmY2inbA-PwyJfsaIIDceYBC-eX-xiCu6qMqkZi3MwQAFL6bMdPEM0z4JBcwFT3VdiWAIRUuACWQwrXMq672x7fMuaIaHi7XDGgt1ith23CLfaREmJku9PQcchbt_uEY-hqrFY6ntTtS4paWWQj86xLL94S-Tf6v6xkL918PfLSOTq6XCzxvlFwzBJqApnAhbwqLjpPhgUG04EDRrqrSBc5Y1BLevn6Ip5h1AhessBp3wLkQgz_roeckt-ybvzKTjESMuagnpqLvOT7Y9veIug2MwPJZI2VjczRc1vzMs25XrFQ8DpUy-bNdp89TmvAXwctUMiJdgHloJw23Cv03gIUAkDnsTqZmkpbIf-crpgNKFmQP_EDKoe8p_PXZZgfbRri3NoEVGP7Mk6yEu8LjJhClhZaBNjuWw2-KlBfOA3g79mhfBnkInee5KO9mGR50qPk1V-MorUYNTFMZIm0kFE6eYVWFBwJHLKYhHU34DoiK1VP-svZpC2uAMFNA_UJEwM9CQ2b8qe4-5e9aywMvwcuArRkAB5mBIfOaOJao3mfukKAE" */
  d?: string;
  /** @example "G4sPXkc6Ya9y8oJW9_ILj4xuppu0lzi_H7VTkS8xj5SdX3coE0oimYwxIi2emTAue0UOa5dpgFGyBJ4c8tQ2VF402XRugKDTP8akYhFo5tAA77Qe_NmtuYZc3C3m3I24G2GvR5sSDxUyAN2zq8Lfn9EUms6rY3Ob8YeiKkTiBj0" */
  dp?: string;
  /** @example "s9lAH9fggBsoFR8Oac2R_E2gw282rT2kGOAhvIllETE1efrA6huUUvMfBcMpn8lqeW6vzznYY5SSQF7pMdC_agI3nG8Ibp1BUb0JUiraRNqUfLhcQb_d9GF4Dh7e74WbRsobRonujTYN1xCaP6TO61jvWrX-L18txXw494Q_cgk" */
  dq?: string;
  /** @example "AQAB" */
  e?: string;
  /** @example "GawgguFyGrWKav7AX4VKUg" */
  k?: string;
  /**
   * The "kid" (key ID) parameter is used to match a specific key. This
   * is used, for example, to choose among a set of keys within a JWK Set
   * during key rollover. The format of the "kid" value is
   * unspecified.  When "kid" values are used within a JWK Set, different
   * keys within the JWK Set SHOULD use distinct "kid" values.  (One
   * example in which different keys might use the same "kid" value is if
   * they have different "kty" (key type) values but are considered to be
   * equivalent alternatives by the application using them.)  The "kid"
   * value is a case-sensitive string.
   * @example "1603dfe0af8f4596"
   */
  kid: string;
  /**
   * The "kty" (key type) parameter identifies the cryptographic
   * algorithm
   *
   * family used with the key, such as "RSA" or "EC". "kty" values should
   *
   * either be registered in the IANA "JSON Web Key Types" registry
   *
   * established by [JWA] or be a value that contains a Collision-
   *
   * Resistant Name.  The "kty" value is a case-sensitive string.
   * @example "RSA"
   */
  kty: string;
  /** @example "vTqrxUyQPl_20aqf5kXHwDZrel-KovIp8s7ewJod2EXHl8tWlRB3_Rem34KwBfqlKQGp1nqah-51H4Jzruqe0cFP58hPEIt6WqrvnmJCXxnNuIB53iX_uUUXXHDHBeaPCSRoNJzNysjoJ30TIUsKBiirhBa7f235PXbKiHducLevV6PcKxJ5cY8zO286qJLBWSPm-OIevwqsIsSIH44Qtm9sioFikhkbLwoqwWORGAY0nl6XvVOlhADdLjBSqSAeT1FPuCDCnXwzCDR8N9IFB_IjdStFkC-rVt2K5BYfPd0c3yFp_vHR15eRd0zJ8XQ7woBC8Vnsac6Et1pKS59pX6256DPWu8UDdEOolKAPgcd_g2NpA76cAaF_jcT80j9KrEzw8Tv0nJBGesuCjPNjGs_KzdkWTUXt23Hn9QJsdc1MZuaW0iqXBepHYfYoqNelzVte117t4BwVp0kUM6we0IqyXClaZgOI8S-WDBw2_Ovdm8e5NmhYAblEVoygcX8Y46oH6bKiaCQfKCFDMcRgChme7AoE1yZZYsPbaG_3IjPrC4LBMHQw8rM9dWjJ8ImjicvZ1pAm0dx-KHCP3y5PVKrxBDf1zSOsBRkOSjB8TPODnJMz6-jd5hTtZxpZPwPoIdCanTZ3ZD6uRBpTmDwtpRGm63UQs1m5FWPwb0T2IF0" */
  n?: string;
  /** @example "6NbkXwDWUhi-eR55Cgbf27FkQDDWIamOaDr0rj1q0f1fFEz1W5A_09YvG09Fiv1AO2-D8Rl8gS1Vkz2i0zCSqnyy8A025XOcRviOMK7nIxE4OH_PEsko8dtIrb3TmE2hUXvCkmzw9EsTF1LQBOGC6iusLTXepIC1x9ukCKFZQvdgtEObQ5kzd9Nhq-cdqmSeMVLoxPLd1blviVT9Vm8-y12CtYpeJHOaIDtVPLlBhJiBoPKWg3vxSm4XxIliNOefqegIlsmTIa3MpS6WWlCK3yHhat0Q-rRxDxdyiVdG_wzJvp0Iw_2wms7pe-PgNPYvUWH9JphWP5K38YqEBiJFXQ" */
  p?: string;
  /** @example "0A1FmpOWR91_RAWpqreWSavNaZb9nXeKiBo0DQGBz32DbqKqQ8S4aBJmbRhJcctjCLjain-ivut477tAUMmzJwVJDDq2MZFwC9Q-4VYZmFU4HJityQuSzHYe64RjN-E_NQ02TWhG3QGW6roq6c57c99rrUsETwJJiwS8M5p15Miuz53DaOjv-uqqFAFfywN5WkxHbraBcjHtMiQuyQbQqkCFh-oanHkwYNeytsNhTu2mQmwR5DR2roZ2nPiFjC6nsdk-A7E3S3wMzYYFw7jvbWWoYWo9vB40_MY2Y0FYQSqcDzcBIcq_0tnnasf3VW4Fdx6m80RzOb2Fsnln7vKXAQ" */
  q?: string;
  /** @example "GyM_p6JrXySiz1toFgKbWV-JdI3jQ4ypu9rbMWx3rQJBfmt0FoYzgUIZEVFEcOqwemRN81zoDAaa-Bk0KWNGDjJHZDdDmFhW3AN7lI-puxk_mHZGJ11rxyR8O55XLSe3SPmRfKwZI6yU24ZxvQKFYItdldUKGzO6Ia6zTKhAVRU" */
  qi?: string;
  /**
   * Use ("public key use") identifies the intended use of
   * the public key. The "use" parameter is employed to indicate whether
   * a public key is used for encrypting data or verifying the signature
   * on data. Values are commonly "sig" (signature) or "enc" (encryption).
   * @example "sig"
   */
  use: string;
  /** @example "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU" */
  x?: string;
  /**
   * The "x5c" (X.509 certificate chain) parameter contains a chain of
   * one or more PKIX certificates [RFC5280].  The certificate chain is
   * represented as a JSON array of certificate value strings.  Each
   * string in the array is a base64-encoded (Section 4 of [RFC4648] --
   * not base64url-encoded) DER [ITU.X690.1994] PKIX certificate value.
   * The PKIX certificate containing the key value MUST be the first
   * certificate.
   */
  x5c?: string[];
  /** @example "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0" */
  y?: string;
};

export type LoginJSONWebKeySetResponse = {
  /** The value of the 'keys' parameter is an array of JWK values.  By default, the order of the JWK values within the array does not imply an order of preference among them, although applications of JWK Sets can choose to assign a meaning to the order for their purposes, if desired. */
  keys?: LoginJSONWebKey[];
};

/**
 * WellKnown
 * It includes links to several endpoints (e.g. /oauth2/token) and exposes information on supported signature algorithms among others.
 */
export type LoginWellKnownResponse = {
  /**
   * URL of the OP's OAuth 2.0 Authorization Endpoint.
   * @example "https://apitest.vipps.no/access-management-1.0/access/oauth2/auth"
   */
  authorization_endpoint: string;
  /**
   * Boolean value specifying whether the OP supports use of the claims parameter, with true indicating support.
   * @example false
   */
  claims_parameter_supported?: boolean;
  /** JSON array containing a list of the Claim Names of the Claims that the OpenID Provider MAY be able to supply values for. Note that for privacy or other reasons, this might not be an exhaustive list. */
  claims_supported?: string[];
  /** JSON array containing a list of the OAuth 2.0 Grant Type values that this OP supports. */
  grant_types_supported?: string[];
  /** JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT. */
  id_token_signing_alg_values_supported: string[];
  /**
   * URL using the https scheme with no query or fragment component that the OP asserts as its IssuerURL Identifier. If IssuerURL discovery is supported , this value MUST be identical to the issuer value returned by WebFinger. This also MUST be identical to the iss Claim value in ID Tokens issued from this IssuerURL.
   * @example "https://apitest.vipps.no/access-management-1.0/access/"
   */
  issuer: string;
  /**
   * URL of the OP's JSON Web Key Set [JWK] document. This contains the signing key(s) the RP uses to validate signatures from the OP. The JWK Set MAY also contain the Server's encryption key(s), which are used by RPs to encrypt requests to the Server. When both signing and encryption keys are made available, a use (Key Use) parameter value is REQUIRED for all keys in the referenced JWK Set to indicate each key's intended usage. Although some algorithms allow the same key to be used for both signatures and encryption, doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509 representations of keys provided. When used, the bare key values MUST still be present and MUST match those in the certificate.
   * @example "https://apitest.vipps.no/access-management-1.0/access/.well-known/jwks.json"
   */
  jwks_uri: string;
  /**
   * Boolean value specifying whether the OP supports use of the request parameter, with true indicating support.
   * @example true
   */
  request_parameter_supported?: boolean;
  /**
   * Boolean value specifying whether the OP supports use of the request_uri parameter, with true indicating support.
   * @example true
   */
  request_uri_parameter_supported?: boolean;
  /**
   * Boolean value specifying whether the OP requires any request_uri values used to be pre-registered using the request_uris registration parameter.
   * @example true
   */
  require_request_uri_registration?: boolean;
  /** JSON array containing a list of the OAuth 2.0 response_mode values that this OP supports. */
  response_modes_supported?: string[];
  /** JSON array containing a list of the OAuth 2.0 response_type values that this OP supports. */
  response_types_supported: string[];
  /** JSON array containing a list of the OAuth 2.0 [RFC6749] scope values that this server supports. The server MUST support the openid scope value. Servers MAY choose not to advertise some supported scope values even when this parameter is used. */
  scopes_supported?: string[];
  /** JSON array containing a list of the Subject Identifier types that this OP supports. Valid types include pairwise and public. */
  subject_types_supported: string[];
  /** URL of the OP's OAuth 2.0 Token Endpoint */
  token_endpoint: string;
  /** JSON array containing a list of Client Authentication methods supported by this Token Endpoint. The options are client_secret_post, client_secret_basic, client_secret_jwt, and private_key_jwt, as described in Section 9 of OpenID Connect Core 1.0 */
  token_endpoint_auth_methods_supported?: string[];
};

export type LoginOauthTokenRequest = {
  /**
   * Value MUST be authorization_code.
   *
   * @example "authorization_code"
   */
  grant_type: string;
  /**
   * The authorization code received from the authorization server as a query param on the redirect_uri.
   *
   * @example "RkVyljMpecv-2Yxc2dzAh8lEtXvkhJAcHNfbkf8CEh4.pt5pTqDgWk8lik-LHuAE2yQGBganPsSa04JkNnSbsaN"
   */
  code: string;
  /**
   * The redirect URL which the user agent is redirected to
   * after finishing a login.
   *
   * If the URL is using a custom URL scheme, such as myapp://,
   * a path is required: myapp://path-to-something.
   *
   * The URL must be exactly the same as the one specified on portal.vipps.no.
   *
   * Be extra careful with trailing slashes and URL-encoded entities.
   *
   * @example "https://example.com/vipps-login-result-page"
   */
  redirect_uri: string;
  /**
   * The client ID is available on portal.vipps.no, under the 'Utvikler' section.
   *
   * This parameter is required if the token endpoint authentication method is set to client_secret_post.
   *
   * @example "fb492b5e-7907-4d83-ba20-c7fb60ca35de"
   */
  client_id?: string;
  /**
   * The client secret is available on portal.vipps.no, under the 'Utvikler' section.
   *
   * This parameter is required if the token endpoint authentication method is set to client_secret_post.
   *
   * @example "fb492b5e-7907-4d83-ba20-c7fb60ca35de"
   */
  client_secret?: string;
  /**
   * Required if PKCE, https://tools.ietf.org/html/rfc7636, is used.
   *
   * @example "RuzfVVEowM_e9wkyTjNCmCz4PKL4MOh2FACGhGRsAq4"
   */
  code_verifier?: string;
};

/**
 * The token response
 * @example {"access_token":"shxuQPSLpKAiBrgD-HPbgDWc3RHzcXq3skcydKwRroo.Y5aH3PavJkZnSq5dffj8AmKVE-SdwRcbKhUKkmqimoQ","expires_in":3599,"id_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzo2ZjIxMTlkZS03ZWY4LTQ0NDQtYjNkYy1lNDNiYWY2MDUwMGYifQ.eyJhdF9oYXNoIjoiUGpLVVQ0VUpFYkZWY05MempyOVppQSIsImF1ZCI6WyJlZGRkYjMyZi01MDI4LTQzOTctYjBhYi1lOGVjZjIxOGZkYzIiXSwiYXV0aF90aW1lIjoxNjQzMTIwMjA0LCJleHAiOjE2NDMxMjM4MDUsImlhdCI6MTY0MzEyMDIwNSwiaXNzIjoiaHR0cHM6Ly9lY2U0NmVjNC02ZjljLTQ4OWItOGZlNS0xNDZhODllMTE2MzUudGVjaC0wMi5uZXQvYWNjZXNzLW1hbmFnZW1lbnQtMS4wL2FjY2Vzcy8iLCJqdGkiOiI1MzM2NzJlYi1lY2M0LTQ0OTQtYjM4NS02NWY2MGJkMTk1YTciLCJub25jZSI6IjU4OTU0MTFlLWU5MzAtNDMyYS05ZWIzLWQzYTAzODhlMWIzOSIsInJhdCI6MTY0MzEyMDAwNywic2lkIjoiYWJlMjIzOTUtZThkNC00ODFlLThjZDItNTU0YmYwOWY0MzJmIiwic3ViIjoiNjNkODMwM2YtNDFkNS00MTUwLTllMzMtMGEzOWVkODE4NTZjIn0.Nejx0nIAPhGjDAOKIpLUVK2bcfTmUr7JfKU8V_7SHUdLGFjSHmDSXkAqYIL_oFXmTQsBrVXTQO-yjL6WGpR5nrpYPHzpY7hMUj00VQ1KTd9gwoMk6uBDvXAnSN7O-cNqC0ehZAlZ6ofR9TwDn03fhS1UcxhLnFq9phzxKD4q7EgBkHOQiwv90M8ZvrZMqdwtdjqIOABks0tVcYlQFKKDDrij0Df90vrFR-coAZeXJzRGsMUivvZlkwlYEQAlTx2BxBT2WqJr407DX-W0k0mj7QPnPQNV-0qT0VLJ6liUwFUi6MQrQ01yosrHwrmwY-0f_GwDDSPp4HizkTmT_CecQy9CLsbnASrcBurpLvjl9bfxXiYtZvvDlxyoyjMd05z94MmuADvM-nIWztKHIbU4ez6qRS1uyMPN2P9-_wzD7Tj2RCrAfSHlgTrx-grhqdkIqcVKdx8RVj5cmmbLDsmgfwLdM0m5Z_QYmctxq7TsLWm0x2A2-rbxlAma5USRDfPpzWBwbZDbJygXEIccGUwgG7SK6XHeTblHmgz87Tx7yfqTw9YSYbzxjnCCBwCXlKUUcHOLMRF_L0BwTBaNaFtYfgc5ne68Ej0V2Mz_BodR3OpRnukTdb1_nXAbDs4JiKhM22aR3R7qopAUnhUAFbde2q1sfwGr-b21a4NgEaWtFwk","token_type":"bearer","scope":"openid name phoneNumber address birthDate email"}
 */
export type LoginOauthTokenResponse = {
  /** The access token issued by the authorization server. */
  access_token?: string;
  /**
   * The lifetime in seconds of the access token.  For example, the value
   * "3600" denotes that the access token will
   * expire in one hour from the time the response was generated.
   * @format int64
   */
  expires_in?: number;
  /**
   * To retrieve a refresh token request the id_token scope.
   * @format int64
   */
  id_token?: number;
  /**
   * The refresh token, which can be used to obtain new
   * access tokens. To retrieve it add the scope "offline" to your access token request.
   */
  refresh_token?: string;
  /** The scope of the access token */
  scope?: string;
  /** The type of the token issued */
  token_type?: string;
};

/**
 * ErrorResponse
 * Error responses are sent when an error (e.g. unauthorized, bad request, etc) occurred.
 * @example {"error":"invalid_request","error_code":400,"error_debug":"The request is missing a required parameter, includes an invalid parameter or is otherwise malformed."}
 */
export type LoginErrorResponse = {
  /** Name is the error name. */
  error: string;
  /**
   * Code represents the error status code (404, 403, 401, ...).
   * @format int64
   */
  error_code?: number;
  /** Debug contains debug information. This is usually not available and has to be enabled. */
  error_debug?: string;
};

export type AccessToken = {
  token_type: "Bearer";
  expires_in: string;
  ext_expires_in: string;
  access_token: string;
  expires_on: string;
  not_before: string;
  resource: string;
};

export type AccessTokenError = {
  error: string;
  error_description: string;
  error_codes: number[];
  timestamp: Date;
  trace_id: string;
  correlation_id: string;
  error_uri: string;
};

// TODO: Review .NET SDK examples in developer docs. Could they use the JS SDK instead?
// TODO: Find good samples, we have a recommended flow with recurring for example.

// TODO: Catch Logintype errors

import { RequestData } from "../types.ts";
import {
  LoginErrorResponse,
  LoginOauthTokenRequest,
  LoginOauthTokenResponse,
  LoginWellKnownResponse,
} from "./types/login_types.ts";

export const loginRequestFactory = {
  discover(): RequestData<LoginWellKnownResponse, LoginErrorResponse> {
    return {
      url: `/access-management-1.0/access/.well-known/openid-configuration`,
      method: "GET",
    };
  },
  // TODO: Token should be ClientId + ":" + ClientSecret
  getToken(
    token: string,
    body: LoginOauthTokenRequest,
  ): RequestData<LoginOauthTokenResponse, LoginErrorResponse> {
    return {
      url: `/access-management-1.0/access/oauth2/token`,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      token,
    };
  },
} as const;

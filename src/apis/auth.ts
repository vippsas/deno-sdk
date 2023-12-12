import { ClientConfig, RequestData } from "../types.ts";
import { AccessToken, AccessTokenError } from "./types/auth_types.ts";

type Credentials = {
  /** Client ID for the merchant (the "username"). Found in the Vipps portal.
   * Example: "fb492b5e-7907-4d83-bc20-c7fb60ca35de". */
  clientId: string;
  /** Client Secret for the merchant (the "password"). Found in the Vipps portal.
   * Example: "Y8Kteew6GE3ZmeycEt6egg==" */
  clientSecret: string;
} & Pick<ClientConfig, "subscriptionKey">;

export const authRequestFactory = {
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

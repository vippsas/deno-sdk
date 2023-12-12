import { RequestData } from "../types.ts";
import {
  WebhooksErrorResponse,
  WebhooksGetRegisteredOKResponse,
  WebhooksRegisterOKResponse,
  WebhooksRegisterRequest,
} from "./types/webhooks_types.ts";

export const webhooksRequestFactory = {
  register(
    token: string,
    body: WebhooksRegisterRequest,
  ): RequestData<WebhooksRegisterOKResponse, WebhooksErrorResponse> {
    return {
      url: "/webhooks/v1/webhooks",
      method: "POST",
      body: body,
      token,
    };
  },
  list(
    token: string,
  ): RequestData<WebhooksGetRegisteredOKResponse, WebhooksErrorResponse> {
    return {
      url: "/webhooks/v1/webhooks",
      method: "GET",
      token,
    };
  },
  delete(
    token: string,
    webhookId: `${string}-${string}-${string}-${string}-${string}`,
  ): RequestData<void, WebhooksErrorResponse> {
    return {
      url: `/webhooks/v1/webhooks/${webhookId}`,
      method: "DELETE",
      token,
    };
  },
} as const;

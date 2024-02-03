import { RequestData } from "../types.ts";
import {
  WebhooksErrorResponse,
  WebhooksGetRegisteredOKResponse,
  WebhooksRegisterOKResponse,
  WebhooksRegisterRequest,
} from "./types/webhooks_types.ts";

/**
 * Factory object for creating webhooks requests.
 */
export const webhooksRequestFactory = {
  /**
   * Registers a webhook. At most 5 webhooks (five separate URLs) can be
   * registered per event, please contact us if a higher limit is required.
   *
   * @param token - The authentication token.
   * @param body - The request body containing the webhook details.
   * @returns A `WebhooksRegisterOKResponse` or `WebhooksErrorResponse` object.
   */
  register: (
    token: string,
    body: WebhooksRegisterRequest,
  ): RequestData<WebhooksRegisterOKResponse, WebhooksErrorResponse> => {
    return {
      url: "/webhooks/v1/webhooks",
      method: "POST",
      body: body,
      token,
    };
  },
  /**
   * Retrieves a list of registered webhooks.
   *
   * @param token - The access token for authentication.
   * @returns A `WebhooksGetRegisteredOKResponse` or `WebhooksErrorResponse` object.
   */
  list: (
    token: string,
  ): RequestData<WebhooksGetRegisteredOKResponse, WebhooksErrorResponse> => {
    return {
      url: "/webhooks/v1/webhooks",
      method: "GET",
      token,
    };
  },
  /**
   * Deletes a webhook.
   *
   * @param token - The authentication token.
   * @param webhookId - The ID of the webhook to delete.
   * @returns void or a `WebhooksErrorResponse` object.
   */
  delete: (
    token: string,
    webhookId: `${string}-${string}-${string}-${string}-${string}`,
  ): RequestData<void, WebhooksErrorResponse> => {
    return {
      url: `/webhooks/v1/webhooks/${webhookId}`,
      method: "DELETE",
      token,
    };
  },
};

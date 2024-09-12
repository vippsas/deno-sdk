import type { RequestData } from "../types.ts";
import type {
  ProblemDetails,
  QueryResponse,
  RegisterRequest,
  RegisterResponse,
} from "./external_types.ts";

/**
 * Factory object for creating webhooks requests.
 */
export const webhooksRequestFactory = {
  /**
   * There is a limit to the number of webhooks that can be registered
   * per event, see the developer guide for more information.
   *
   * @param token - The authentication token.
   * @param body - The request body containing the webhook details.
   * @returns A `RegisterResponse` or `ProblemDetails` object.
   */
  register: (
    token: string,
    body: RegisterRequest,
  ): RequestData<RegisterResponse, ProblemDetails> => {
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
   * @returns A `WebhooksGetRegisteredOKResponse` or `ProblemDetails` object.
   */
  list: (
    token: string,
  ): RequestData<QueryResponse, ProblemDetails> => {
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
   * @returns void or a `ProblemDetails` object.
   */
  delete: (
    token: string,
    webhookId: string,
  ): RequestData<void, ProblemDetails> => {
    return {
      url: `/webhooks/v1/webhooks/${webhookId}`,
      method: "DELETE",
      token,
    };
  },
};

import { RequestData } from "../types.ts";
import {
  ChargeReference,
  ChargeResponseV3,
  CreateChargeV3,
} from "./types/charge_types.ts";
import { RecurringErrorResponse } from "./types/recurring_types.ts";

/**
 * Factory object for managing charge API requests.
 */
export const chargeRequestFactory = {
  /**
   * Creates a new recurring charge (payment) that will charge the user
   * on the date specified. If the payment fails,
   * the charge will be retried based on retryDays
   *
   * @param token - The authentication token.
   * @param body - The request body containing the charge details.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  create(
    token: string,
    body: CreateChargeV3,
    agreementId: string,
  ): RequestData<ChargeReference, RecurringErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Fetches a single charge for a user.
   *
   * @param token - The authentication token.
   * @param chargeId - The ID of the charge to retrieve.
   * @param agreementId - The ID of the agreement.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  info: (
    token: string,
    agreementId: string,
    chargeId: string,
  ): RequestData<ChargeResponseV3, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges/${chargeId}`,
      method: "GET",
      token,
    };
  },
} as const;

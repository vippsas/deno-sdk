import { RequestData } from "../types.ts";
import {
  ChargeReference,
  ChargeResponseV3,
  ChargeStatus,
  CreateChargeV3,
  ModifyCharge,
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
    agreementId: string,
    body: CreateChargeV3,
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
  info(
    token: string,
    agreementId: string,
    chargeId: string,
  ): RequestData<ChargeResponseV3, RecurringErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges/${chargeId}`,
      method: "GET",
      token,
    };
  },
  /**
   * Retrieves information about a charge by its ID. A "special case"
   * endpoint to fetch a single charge just by chargeId, when the
   * agreementId is unknown. This is useful for investigating
   * claims from customers, but not intended for automation.
   *
   * Please note: This is not a replacement for the normal endpoint
   * for fetching charges
   *
   * @param token - The access token.
   * @param chargeId - The ID of the charge.
   * @returns A `RequestData` object containing the URL, method, and token.
   */
  infoById(
    token: string,
    chargeId: string,
  ): RequestData<ChargeResponseV3, RecurringErrorResponse> {
    return {
      url: `/recurring/v3/agreements/charges/${chargeId}`,
      method: "GET",
      token,
    };
  },
  /**
   * Fetches all charges for a single agreement, including the optional
   * initial charge. Supports filtering on status using query parameter.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  list(
    token: string,
    agreementId: string,
    status?: ChargeStatus,
  ): RequestData<ChargeResponseV3[], RecurringErrorResponse> {
    const url = status
      ? `/recurring/v3/agreements/${agreementId}/charges?status=${status}`
      : `/recurring/v3/agreements/${agreementId}/charges`;

    return { url, method: "GET", token };
  },
  /**
   * Cancels a pending, due or reserved charge. When cancelling a charge
   * that is PARTIALLY_CAPTURED, the remaining funds on the charge
   * will be released back to the customer.
   *
   * Note if you cancel an agreement, there is no need to cancel the
   * charges that belongs to the agreement. This will be done automatically.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement.
   * @param chargeId - The ID of the charge.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  cancel(
    token: string,
    agreementId: string,
    chargeId: string,
  ): RequestData<void, RecurringErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges/${chargeId}`,
      method: "DELETE",
      token,
    };
  },
  /**
   * Captures a reserved charge. Only charges with transactionType
   * RESERVE_CAPTURE can be captured. Can also do partial captures
   * (captures a smaller part of the payment).
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement.
   * @param chargeId - The ID of the charge.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  capture(
    token: string,
    agreementId: string,
    chargeId: string,
    body: ModifyCharge,
  ): RequestData<void, RecurringErrorResponse> {
    return {
      url:
        `/recurring/v3/agreements/${agreementId}/charges/${chargeId}/capture`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Refunds a charge, can also do a partial refund
   * (refunding a smaller part of the payment).
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement.
   * @param chargeId - The ID of the charge.
   * @returns A RequestData object containing the URL, method, and token for the API request.
   */
  refund(
    token: string,
    agreementId: string,
    chargeId: string,
    body: ModifyCharge,
  ): RequestData<void, RecurringErrorResponse> {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges/${chargeId}/refund`,
      method: "POST",
      body,
      token,
    };
  },
} as const;

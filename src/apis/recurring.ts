import type { RequestData } from "../types.ts";
import type {
  RecurringAgreementResponseV3,
  RecurringAsyncChargeResponse,
  RecurringChargeReference,
  RecurringChargeResponseV3,
  RecurringChargeStatus,
  RecurringCreateChargeAsyncV3,
  RecurringCreateChargeV3,
  RecurringDraftAgreementResponseV3,
  RecurringDraftAgreementV3,
  RecurringErrorResponse,
  RecurringForceAcceptAgreementV3,
  RecurringPatchAgreementV3,
  RecurringRefundRequest,
  RecurringStatus,
} from "./types/recurring_types.ts";

/**
 * Factory object for creating and managing agreements.
 */
export const agreementRequestFactory = {
  /**
   * The API endpoint allows merchants to create agreements for a user to accept.
   * Once the agreement is drafted, you will receive a vippsConfirmationUrl.
   * This is used to redirect the user to the Vipps MobilePay landing page,
   * or to the Vipps or MobilePay app when "isApp":true is used.
   *
   * If the user accepts or rejects the agreement, the user will be redirected back to
   * whichever URL has been passed in merchantRedirectUrl. You must implement polling
   * on the agreement to check when the status changes to active, instead of relying
   * on the redirect back to the merchantRedirectUrl. We have no control over if a user
   * is actually redirected back or not, this depends on what browser the user came from.
   *
   * Please note the different use cases for initialCharge and campaign.
   * And when to use RESERVE_CAPTURE instead of DIRECT_CAPTURE as transactionType.
   * More information about this can be found in the API documentation.
   *
   * @param token - The authentication token.
   * @param body - The draft agreement data.
   * @returns A `DraftAgreementResponseV3` or `RecurringErrorResponse` object.
   */
  create: (
    token: string,
    body: RecurringDraftAgreementV3,
  ): RequestData<RecurringDraftAgreementResponseV3, RecurringErrorResponse> => {
    return {
      url: "/recurring/v3/agreements",
      method: "POST",
      body,
      token,
    };
  },
  /**
   * The API endpoint allows merchant to fetch all agreements. If no query
   * status is supplied it will default to only retrieving active agreements.
   * There is no way to list all Agreements with all statuses, this is due to performance.
   * Use the createdAfter query to paginate the response.
   *
   * @param token - The authentication token.
   * @param status - The status of the agreements to retrieve.
   * @param createdAfter - The timestamp indicating the minimum creation date of the agreements to retrieve.
   * @returns A `AgreementResponseV3` or `RecurringErrorResponse` object.
   */
  list: (
    token: string,
    status: RecurringStatus,
    createdAfter: number,
  ): RequestData<RecurringAgreementResponseV3, RecurringErrorResponse> => {
    return {
      url:
        `/recurring/v3/agreements?status=${status}&createdAfter=${createdAfter}`,
      method: "GET",
      token,
    };
  },
  /**
   * Fetch a single agreement for a user. Recommended to use when polling for status changes
   * after sending an agreement to a user.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement to retrieve.
   * @returns A `AgreementResponseV3` or `RecurringErrorResponse` object.
   */
  info: (
    token: string,
    agreementId: string,
  ): RequestData<RecurringAgreementResponseV3, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}`,
      method: "GET",
      token,
    };
  },
  /**
   * Updates the agreement. Note that when updating the status to STOPPED, you can not re-activate it.
   * If you want to pause an agreement, we suggest leaving the agreement active and skipping
   * the creation of charges as long as the agreement is paused in your systems.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement to update.
   * @param body - The patch data for the agreement.
   * @returns void or a `RecurringErrorResponse` object.
   */
  update: (
    token: string,
    agreementId: string,
    body: RecurringPatchAgreementV3,
  ): RequestData<void, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}`,
      method: "PATCH",
      body,
      token,
    };
  },
  /**
   * Forces an agreement to be accepted by the given customer phone number.
   * This endpoint can only be used in the test environment.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement to force accept.
   * @param body - The force accept data for the agreement.
   * @returns void or a `RecurringErrorResponse` object.
   */
  forceAccept: (
    token: string,
    agreementId: string,
    body: RecurringForceAcceptAgreementV3,
  ): RequestData<void, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}/accept`,
      method: "PATCH",
      body,
      token,
    };
  },
};

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
   * @param agreementId - The ID of the agreement.
   * @param body - The request body containing the charge details.
   * @returns A `ChargeReference` or `RecurringErrorResponse` object.
   */
  create: (
    token: string,
    agreementId: string,
    body: RecurringCreateChargeV3,
  ): RequestData<RecurringChargeReference, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Asynchronously creates multiple new recurring charges (payments) that
   * will be automatically processed on the due date. If the payment fails,
   * the charge will be retried based on retryDays
   *
   * @param token - The authentication token.
   * @param body - The request body containing the charge details.
   * @returns An array of `RecurringAsyncChargeResponse` objects,
   * or a `RecurringErrorResponse` object.
   */
  createMultiple: (
    token: string,
    body: RecurringCreateChargeAsyncV3[],
  ): RequestData<RecurringAsyncChargeResponse[], RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/charges`,
      method: "POST",
      body,
      token,
    };
  },
  /**
   * Fetches a single charge for a user.
   *
   * @param token - The authentication token.
   * @param agreementId - The ID of the agreement.
   * @param chargeId - The ID of the charge to retrieve.
   * @returns A `ChargeResponseV3` or `RecurringErrorResponse` object.
   */
  info: (
    token: string,
    agreementId: string,
    chargeId: string,
  ): RequestData<RecurringChargeResponseV3, RecurringErrorResponse> => {
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
   * @returns A `ChargeResponseV3` or `RecurringErrorResponse` object.
   */
  infoById: (
    token: string,
    chargeId: string,
  ): RequestData<RecurringChargeResponseV3, RecurringErrorResponse> => {
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
   * @param status - The status of the charges to retrieve (optional).
   * @returns An array of `ChargeResponseV3` objects, or a `RecurringErrorResponse` object.
   */
  list: (
    token: string,
    agreementId: string,
    status?: RecurringChargeStatus,
  ): RequestData<RecurringChargeResponseV3[], RecurringErrorResponse> => {
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
   * @returns void or a `RecurringErrorResponse` object.
   */
  cancel: (
    token: string,
    agreementId: string,
    chargeId: string,
  ): RequestData<void, RecurringErrorResponse> => {
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
   * @param body - The request body containing the charge modification details.
   * @returns void or a `RecurringErrorResponse` object.
   */
  capture: (
    token: string,
    agreementId: string,
    chargeId: string,
    body: RecurringRefundRequest,
  ): RequestData<void, RecurringErrorResponse> => {
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
   * @param body - The request body containing the charge modification details.
   * @returns void or a `RecurringErrorResponse` object.
   */
  refund: (
    token: string,
    agreementId: string,
    chargeId: string,
    body: RecurringRefundRequest,
  ): RequestData<void, RecurringErrorResponse> => {
    return {
      url: `/recurring/v3/agreements/${agreementId}/charges/${chargeId}/refund`,
      method: "POST",
      body,
      token,
    };
  },
};

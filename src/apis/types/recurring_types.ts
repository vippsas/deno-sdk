/**
 * Only NOK is supported at the moment. Support for EUR and DKK will be provided in early 2024.
 * @minLength 3
 * @maxLength 3
 * @pattern ^[A-Z]{3}$
 * @example "NOK"
 */
export type RecurringCurrencyV3 = "NOK";

/**
 * @default "RECURRING"
 * @example "RECURRING"
 */
export type ChargeType = "INITIAL" | "RECURRING";

/**
 * Type of transaction, either direct capture or reserve capture
 * @example "DIRECT_CAPTURE"
 */
export type RecurringTransactionType = "DIRECT_CAPTURE" | "RESERVE_CAPTURE";

///////////////// Error types /////////////////

export type RecurringErrorResponse = RecurringErrorV3 | RecurringErrorFromAzure;

/**
 * Error response
 * Error response using the Problem JSON format
 */
type RecurringErrorV3 = {
  /**
   * Path to type of error
   * @example "https://developer.vippsmobilepay.com/docs/APIs/recurring-api/recurring-api-problems#validation-error"
   */
  type?: string;
  /**
   * Short description of the error
   * @example "Bad Request"
   */
  title?: string;
  /**
   * HTTP status returned with the problem
   * @format int32
   * @example 400
   */
  status?: number;
  /**
   * Details about the error
   * @example "Input validation failed"
   */
  detail?: string;
  /**
   * The path of the request
   * @example "/v3/agreements"
   */
  instance?: string;
  /**
   * An unique ID for the request
   * @example "f70b8bf7-c843-4bea-95d9-94725b19895f"
   */
  contextId?: string;
  extraDetails?: {
    /**
     * Field to provide additional details on
     * @example "productName"
     */
    field?: string;
    /**
     * Details for the error of a specific field
     * @example "must not be empty"
     */
    text?: string;
  }[];
};

/**
 * An error from Microsoft Azure. We have limited control of these errors,
 * and can not give as detailed information as with the errors from our own code.
 * The most important property is the HTTP status code.
 */
type RecurringErrorFromAzure = {
  responseInfo: {
    /** @example 401 */
    responseCode: number;
    /** @example "Unauthorized" */
    responseMessage: string;
  };
  result: {
    /**
     * When possible: A description of what went wrong.
     * @example "(An error from Azure API Management, possibly related to authentication)"
     */
    message: string;
  };
};

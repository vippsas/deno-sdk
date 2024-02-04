import {
  OrderManagementAddImageOKResponse,
  OrderManagementErrorResponse,
  OrderManagementGetOrderOKResponse,
  OrderManagementImage,
  OrderManagementOKResponse,
  OrderManagementOrder,
  OrderManagementOrderId,
  OrderManagementPaymentType,
  OrderManagementReceipt,
} from "./types/ordermanagement_types.ts";
import { RequestData } from "../types.ts";

/**
 * Factory object for creating request data for the Order Management API.
 */
export const orderManagementRequestFactory = {
  /**
   * The category adds a link, specified by you, to the Transaction page on
   * the Vipps MobilePay app. Only one (the latest) category is shown in the
   * app.
   *
   * @param token - The authentication token.
   * @param orderId - The order ID.
   * @param paymentType - The payment type.
   * @param body - The request body containing the category details.
   * @returns A `OrderManagementOKResponse` or `OrderManagementErrorResponse` object.
   */
  addCategory: (
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
    body: OrderManagementOrder,
  ): RequestData<OrderManagementOKResponse, OrderManagementErrorResponse> => {
    return {
      url: `/order-management/v2/${paymentType}/categories/${orderId}`,
      method: "PUT",
      body,
      token,
    };
  },

  /**
   * Endpoint for uploading images. A imageId will be returned that
   * can be used when adding metadata to orders.
   *
   * @param token - The authentication token.
   * @param body - The request body containing the image details.
   * @returns A `OrderManagementAddImageOKResponse` or `OrderManagementErrorResponse` object.
   */
  addImage: (
    token: string,
    body: OrderManagementImage,
  ): RequestData<
    OrderManagementAddImageOKResponse,
    OrderManagementErrorResponse
  > => {
    return {
      url: "/order-management/v1/images",
      method: "POST",
      body,
      token,
    };
  },

  /**
   * Add receipt to an order.
   *
   * @param token - The authentication token.
   * @param orderId - The order ID.
   * @param paymentType - The payment type.
   * @param body - The request body containing the receipt details.
   * @returns A `OrderManagementOKResponse` or `OrderManagementErrorResponse` object.
   */
  addReceipt: (
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
    body: OrderManagementReceipt,
  ): RequestData<OrderManagementOKResponse, OrderManagementErrorResponse> => {
    return {
      url: `/order-management/v2/${paymentType}/receipts/${orderId}`,
      method: "POST",
      body,
      token,
    };
  },

  /**
   * Get order with category and receipt
   *
   * @param token - The authentication token.
   * @param orderId - The order ID.
   * @param paymentType - The payment type.
   * @returns A `OrderManagementGetOrderOKResponse` or `OrderManagementErrorResponse` object.
   */
  info: (
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
  ): RequestData<
    OrderManagementGetOrderOKResponse,
    OrderManagementErrorResponse
  > => {
    return {
      url: `/order-management/v2/${paymentType}/${orderId}`,
      method: "GET",
      token,
    };
  },
};

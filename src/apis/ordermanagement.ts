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
   */
  addCategory(
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
    body: OrderManagementOrder,
  ): RequestData<
    OrderManagementOKResponse,
    OrderManagementErrorResponse
  > {
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
   */
  addImage(
    token: string,
    body: OrderManagementImage,
  ): RequestData<
    OrderManagementAddImageOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: "/order-management/v1/images",
      method: "POST",
      body,
      token,
    };
  },

  /**
   * Add receipt to an order.
   */
  addReceipt(
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
    body: OrderManagementReceipt,
  ): RequestData<
    OrderManagementOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: `/order-management/v2/${paymentType}/receipts/${orderId}`,
      method: "POST",
      body,
      token,
    };
  },

  /**
   * Get order with category and receipt
   */
  info(
    token: string,
    orderId: OrderManagementOrderId,
    paymentType: OrderManagementPaymentType,
  ): RequestData<
    OrderManagementGetOrderOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: `/order-management/v2/${paymentType}/${orderId}`,
      method: "GET",
      token,
    };
  },
} as const;

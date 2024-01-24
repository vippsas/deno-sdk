import {
  OrderManagementAddCategoryOKResponse,
  OrderManagementAddImageOKResponse,
  OrderManagementAddImageRequest,
  OrderManagementAddReceiptOKResponse,
  OrderManagementAddReceiptRequest,
  OrderManagementErrorResponse,
  OrderManagementGetOrderOKResponse,
  OrderManagementPaymentType,
  TypedOrderManagementAddCategoryToOrderRequest,
} from "./types/ordermanagement_types.ts";
import { RequestData } from "../types.ts";

export const orderManagementRequestFactory = {
  addCategoryToOrder(
    token: string,
    paymentType: OrderManagementPaymentType,
    orderId: string,
    body: TypedOrderManagementAddCategoryToOrderRequest,
  ): RequestData<
    OrderManagementAddCategoryOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: `/order-management/v2/${paymentType}/categories/${orderId}`,
      method: "PUT",
      body: body,
      token,
    };
  },
  addImage(
    token: string,
    body: OrderManagementAddImageRequest,
  ): RequestData<
    OrderManagementAddImageOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: "/order-management/v1/images",
      method: "POST",
      body: body,
      token,
    };
  },
  getOrderWithCategoryAndReceipt(
    token: string,
    paymentType: OrderManagementPaymentType,
    orderId: string,
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
  addReceipt(
    token: string,
    body: OrderManagementAddReceiptRequest,
    paymentType: OrderManagementPaymentType,
    orderId: string,
  ): RequestData<
    OrderManagementAddReceiptOKResponse,
    OrderManagementErrorResponse
  > {
    return {
      url: `/order-management/v2/${paymentType}/receipts/${orderId}`,
      method: "POST",
      body: body,
      token,
    };
  },
} as const;

import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";

export interface CreateOrderData {
  orderId: string;
  paypalOrderId?: string;
  orderStatus?: "pending" | "completed" | "cancelled" | "failed";
  totalAmount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: number;
    documentId: string;
    title: string;
    price: number;
    image: {
      url: string;
      alternativeText?: string;
    };
  }>;
  paymentDetails?: unknown;
}

export async function createOrder(orderData: CreateOrderData) {
  const BASE_URL = getStrapiURL();
  const path = "/api/orders";
  const url = new URL(path, BASE_URL);

  const requestData: Record<string, unknown> = {
    orderId: orderData.orderId,
    orderStatus: orderData.orderStatus || "pending",
    totalAmount: orderData.totalAmount,
    currency: orderData.currency || "SEK",
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    shippingAdress: JSON.stringify(orderData.shippingAddress),
    items: JSON.stringify(orderData.items),
    paypalOrderId: orderData.paypalOrderId || "",
  };

  if (orderData.paymentDetails) {
    requestData.paymentDetails = JSON.stringify(orderData.paymentDetails);
  }

  const response = await fetchAPI(url.href, {
    method: "POST",
    body: {
      data: requestData,
    },
  });

  return response;
}

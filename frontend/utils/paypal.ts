import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";

export interface CreatePayPalOrderData {
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{
    title: string;
    price: number;
    quantity?: number;
  }>;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface CapturePayPalOrderData {
  orderId: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalCaptureResponse {
  success: boolean;
  order: {
    id: string;
    status: string;
    paypalOrderId: string;
  };
  capture: unknown;
}

export async function createPayPalOrder(data: CreatePayPalOrderData): Promise<PayPalOrderResponse> {
  const BASE_URL = getStrapiURL();
  const path = "/api/paypal/create-order";
  const url = new URL(path, BASE_URL);

  const requestData: Record<string, unknown> = {
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency,
    items: data.items,
    ...(data.shippingAddress && { shippingAddress: data.shippingAddress }),
  };

  const response = await fetchAPI(url.href, {
    method: "POST",
    body: requestData,
  });

  if ('error' in response && response.error) {
    throw new Error(response.error.message || "Failed to create PayPal order");
  }

  return response as PayPalOrderResponse;
}

export async function capturePayPalOrder(data: CapturePayPalOrderData): Promise<PayPalCaptureResponse> {
  const BASE_URL = getStrapiURL();
  const path = "/api/paypal/capture-order";
  const url = new URL(path, BASE_URL);

  const requestData: Record<string, unknown> = {
    orderId: data.orderId,
  };

  const response = await fetchAPI(url.href, {
    method: "POST",
    body: requestData,
  });

  if ('error' in response && response.error) {
    throw new Error(response.error.message || "Failed to capture PayPal order");
  }

  return response as PayPalCaptureResponse;
}


"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from "@/utils/paypal";

interface PayPalButtonProps {
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
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export default function PayPalButton({
  orderId,
  amount,
  currency,
  items,
  shippingAddress,
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not configured');
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: currency,
        intent: "capture",
        disableFunding: "card",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "white",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const paypalOrder = await createPayPalOrder({
              orderId,
              amount,
              currency,
              items,
              shippingAddress,
            });
            return paypalOrder.id;
          } catch (error) {
            if (onError) {
              onError(error instanceof Error ? error : new Error(String(error)));
            }
            throw error;
          }
        }}
        onApprove={async (data) => {
          try {
            const result = await capturePayPalOrder({
              orderId: data.orderID,
            });

            if (result.success && onSuccess) {
              onSuccess(result.order.id);
            } else if (onError) {
              onError(new Error("Payment capture failed"));
            }
          } catch (error) {
            if (onError) {
              onError(error instanceof Error ? error : new Error(String(error)));
            }
          }
        }}
        onCancel={() => {
          if (onCancel) {
            onCancel();
          }
        }}
        onError={(error) => {
          if (onError) {
            const errorMessage = typeof error?.message === 'string' ? error.message : "PayPal error occurred";
            onError(new Error(errorMessage));
          }
        }}
      />
    </PayPalScriptProvider>
  );
}


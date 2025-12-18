"use client";

import { useState, useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from "@/utils/paypal";

function hidePayPalOverlay() {
  const selectors = [
    '[data-zoid-paypal-buttons-container]',
    '.zoid-outlet',
    '[data-zoid]',
    'iframe[src*="paypal"]',
    '[id*="paypal"]',
    '[class*="paypal"]',
    '[class*="zoid"]'
  ];
  
  selectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = 'none';
        htmlEl.style.visibility = 'hidden';
        htmlEl.style.opacity = '0';
        htmlEl.style.pointerEvents = 'none';
      });
    } catch {
      // Ignore errors when hiding elements
    }
  });
}

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
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not configured');
  }

  useEffect(() => {
    if (isPaymentComplete) {
      hidePayPalOverlay();
      
      observerRef.current = new MutationObserver(() => {
        hidePayPalOverlay();
      });
      
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id', 'data-zoid']
      });
      
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [isPaymentComplete]);

  if (isPaymentComplete) {
    return null;
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
            setIsPaymentComplete(true);
            hidePayPalOverlay();
            
            if (onSuccess) {
              onSuccess(data.orderID);
            }
            
            const result = await capturePayPalOrder({
              orderId: data.orderID,
            });

            if (!result.success) {
              setIsPaymentComplete(false);
              if (onError) {
                onError(new Error("Payment capture failed"));
              }
            }
          } catch (error) {
            setIsPaymentComplete(false);
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


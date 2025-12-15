/**
 * PayPal service
 */

import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  /**
   * Get PayPal access token
   */
  const getAccessToken = async () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayPal auth failed: ${errorText}`);
      }

      const data = await response.json() as { access_token: string };
      return data.access_token;
    } catch (error) {
      strapi.log.error('PayPal access token error:', error);
      throw error;
    }
  };

  /**
   * Create PayPal order
   */
  const createOrder = async (orderData: {
    amount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: string;
      unit_amount: {
        currency_code: string;
        value: string;
      };
    }>;
    shippingAddress?: {
      address_line_1: string;
      admin_area_2: string;
      postal_code: string;
      country_code: string;
    };
  }): Promise<unknown> => {
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const accessToken = await getAccessToken();

    const purchaseUnits = [
      {
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: orderData.currency,
              value: orderData.amount.toFixed(2),
            },
          },
        },
        items: orderData.items,
        ...(orderData.shippingAddress && {
          shipping: {
            address: orderData.shippingAddress,
          },
        }),
      },
    ];

    try {
      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `order-${Date.now()}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: purchaseUnits,
          application_context: {
            brand_name: process.env.PAYPAL_BRAND_NAME || 'CINC ART',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?canceled=true`,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayPal create order failed: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      strapi.log.error('PayPal create order error:', error);
      throw error;
    }
  };

  /**
   * Capture PayPal order
   */
  const captureOrder = async (orderId: string): Promise<unknown> => {
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    const accessToken = await getAccessToken();

    try {
      const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayPal capture order failed: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      strapi.log.error('PayPal capture order error:', error);
      throw error;
    }
  };

  return {
    getAccessToken,
    createOrder,
    captureOrder,
  };
};


/**
 * PayPal controller
 * 
 * Handles PayPal payment integration:
 * - Creates PayPal orders (server-side for security)
 * - Captures PayPal payments
 * - Validates payment data against database orders to prevent manipulation
 */

// Map country names to ISO 3166-1 alpha-2 codes for PayPal API
const countryCodeMap: Record<string, string> = {
  'sweden': 'SE',
  'sverige': 'SE',
  'united states': 'US',
  'usa': 'US',
  'united kingdom': 'GB',
  'uk': 'GB',
  'norway': 'NO',
  'norge': 'NO',
  'denmark': 'DK',
  'danmark': 'DK',
  'finland': 'FI',
  'germany': 'DE',
  'france': 'FR',
  'spain': 'ES',
  'italy': 'IT',
};

const getCountryCode = (country: string): string => {
  const normalized = country.toLowerCase().trim();
  return countryCodeMap[normalized] || normalized.toUpperCase().substring(0, 2);
};

export default {
  /**
   * Create PayPal order
   */
  async createOrder(ctx) {
    try {
      const { amount, currency, items, shippingAddress, orderId } = ctx.request.body;

      // Validate required fields
      if (!amount || !currency || !items || !Array.isArray(items) || items.length === 0) {
        return ctx.badRequest('Missing required fields: amount, currency, items');
      }

      if (!orderId) {
        return ctx.badRequest('Missing orderId');
      }

      // Find existing order
      const existingOrder = await strapi.entityService.findMany('api::order.order', {
        filters: { orderId },
        limit: 1,
        populate: ['items'],
      });

      if (!existingOrder || existingOrder.length === 0) {
        return ctx.notFound('Order not found');
      }

      const order = existingOrder[0] as {
        id: number;
        totalAmount: number;
        currency: string;
        items?: Array<{ title: string; price: number }>;
      };

      // Security: Validate amount against actual order total
      if (order.totalAmount !== amount) {
        strapi.log.warn(`Amount mismatch for order ${orderId}: expected ${order.totalAmount}, got ${amount}`);
        return ctx.badRequest('Amount does not match order total');
      }

      // Security: Validate currency matches
      if (order.currency !== currency) {
        return ctx.badRequest('Currency does not match order currency');
      }

      // Security: Validate items match order items
      const orderItems = Array.isArray(order.items) ? order.items : [];
      if (orderItems.length !== items.length) {
        strapi.log.warn(`Item count mismatch for order ${orderId}: expected ${orderItems.length}, got ${items.length}`);
        return ctx.badRequest('Items do not match order items');
      }

      // Transform items for PayPal using order data for security
      const paypalItems = orderItems.map((orderItem: { title: string; price: number }, index: number) => {
        const frontendItem = items[index];
        // Use order data, not frontend data, for security
        return {
          name: orderItem.title,
          quantity: frontendItem?.quantity?.toString() || '1',
          unit_amount: {
            currency_code: currency,
            value: orderItem.price.toFixed(2),
          },
        };
      });

      // Create PayPal order
      // Use order.totalAmount from database, not frontend amount, for security
      const paypalService = strapi.service('api::paypal.paypal');
      const paypalOrder = await paypalService.createOrder({
        amount: order.totalAmount,
        currency: order.currency,
        items: paypalItems,
        shippingAddress: shippingAddress ? {
          address_line_1: shippingAddress.address,
          admin_area_2: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country_code: getCountryCode(shippingAddress.country),
        } : undefined,
      });

      // Update order with PayPal order ID
      await strapi.entityService.update('api::order.order', existingOrder[0].id, {
        data: {
          paypalOrderId: paypalOrder.id,
        },
      });

      ctx.body = {
        id: paypalOrder.id,
        status: paypalOrder.status,
        links: paypalOrder.links,
      };
    } catch (error) {
      strapi.log.error('PayPal create order error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Don't expose internal error details to client
      if (errorMessage.includes('Forbidden') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('auth failed')) {
        ctx.throw(403, 'PayPal authentication failed. Please contact support.');
      }
      
      ctx.throw(500, 'Failed to create PayPal order. Please try again.');
    }
  },

  /**
   * Capture PayPal order
   */
  async captureOrder(ctx) {
    try {
      const { orderId } = ctx.request.body;

      if (!orderId) {
        return ctx.badRequest('Missing orderId');
      }

      // Find order by PayPal order ID
      const existingOrder = await strapi.entityService.findMany('api::order.order', {
        filters: { paypalOrderId: orderId },
        limit: 1,
      });

      if (!existingOrder || existingOrder.length === 0) {
        return ctx.notFound('Order not found');
      }

      // Capture PayPal order
      const paypalService = strapi.service('api::paypal.paypal');
      const captureResult = await paypalService.captureOrder(orderId);

      // Check if capture was successful
      const captureData = captureResult as {
        id?: string;
        status?: string;
        payer?: {
          email_address?: string;
        };
      };

      if (captureData.status === 'COMPLETED') {
        // Extract only relevant payment information
        const paymentDetails = {
          paypalOrderId: captureData.id || orderId,
          status: captureData.status,
          completedAt: new Date().toISOString(),
          payerEmail: captureData.payer?.email_address || null,
        };

        // Update order status
        await strapi.entityService.update('api::order.order', existingOrder[0].id, {
          data: {
            orderStatus: 'completed',
            paymentDetails: paymentDetails,
          },
        });

        ctx.body = {
          success: true,
          order: {
            id: existingOrder[0].orderId,
            status: 'completed',
            paypalOrderId: captureData.id || orderId,
          },
        };
      } else {
        // Extract only relevant payment information for failed payment
        const paymentDetails = {
          paypalOrderId: captureData.id || orderId,
          status: captureData.status || 'UNKNOWN',
          failedAt: new Date().toISOString(),
        };

        // Update order status to failed
        await strapi.entityService.update('api::order.order', existingOrder[0].id, {
          data: {
            orderStatus: 'failed',
            paymentDetails: paymentDetails,
          },
        });

        ctx.body = {
          success: false,
          status: captureData.status || 'UNKNOWN',
        };
      }
    } catch (error) {
      strapi.log.error('PayPal capture order controller error:', error);
      // Don't expose internal error details to client
      ctx.throw(500, 'Failed to capture PayPal order. Please contact support.');
    }
  },
};


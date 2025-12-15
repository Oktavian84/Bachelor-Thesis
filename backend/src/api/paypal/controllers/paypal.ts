/**
 * PayPal controller
 */

// Map country names to ISO 3166-1 alpha-2 codes
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
      });

      if (!existingOrder || existingOrder.length === 0) {
        return ctx.notFound('Order not found');
      }

      // Transform items for PayPal
      const paypalItems = items.map((item: { title: string; price: number; quantity?: number }) => ({
        name: item.title,
        quantity: item.quantity?.toString() || '1',
        unit_amount: {
          currency_code: currency,
          value: item.price.toFixed(2),
        },
      }));

      // Create PayPal order
      const paypalService = strapi.service('api::paypal.paypal');
      const paypalOrder = await paypalService.createOrder({
        amount,
        currency,
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
      
      if (errorMessage.includes('Forbidden') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('auth failed')) {
        ctx.throw(403, 'PayPal authentication failed. Please check your PayPal credentials.');
      }
      
      ctx.throw(500, errorMessage || 'Failed to create PayPal order');
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
      if (captureResult.status === 'COMPLETED') {
        // Update order status
        await strapi.entityService.update('api::order.order', existingOrder[0].id, {
          data: {
            orderStatus: 'completed',
            paymentDetails: captureResult,
          },
        });

        ctx.body = {
          success: true,
          order: {
            id: existingOrder[0].orderId,
            status: 'completed',
            paypalOrderId: captureResult.id,
          },
          capture: captureResult,
        };
      } else {
        // Update order status to failed
        await strapi.entityService.update('api::order.order', existingOrder[0].id, {
          data: {
            orderStatus: 'failed',
            paymentDetails: captureResult,
          },
        });

        ctx.body = {
          success: false,
          status: captureResult.status,
          capture: captureResult,
        };
      }
    } catch (error) {
      strapi.log.error('PayPal capture order controller error:', error);
      ctx.throw(500, error.message || 'Failed to capture PayPal order');
    }
  },
};


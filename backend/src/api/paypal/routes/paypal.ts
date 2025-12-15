/**
 * PayPal router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/paypal/create-order',
      handler: 'api::paypal.paypal.createOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/paypal/capture-order',
      handler: 'api::paypal.paypal.captureOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};


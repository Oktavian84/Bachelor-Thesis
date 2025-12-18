"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { StrapiImage } from "@/components/StrapiImage";
import { createOrder } from "@/utils/orders";
import PayPalButton from "@/components/PayPalButton";
import emailjs from "@emailjs/browser";

export default function CheckoutPage() {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        setPaymentSuccess(null);
        clearCart();
        setFormData({
          name: "",
          email: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, clearCart]);

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="bg-black text-white flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const orderResponse = await createOrder({
        orderId,
        orderStatus: "pending",
        totalAmount: totalPrice,
        currency: "SEK",
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          price: item.price,
          image: {
            url: item.image.url,
            alternativeText: item.image.alternativeText,
          },
        })),
      });

      if (!orderResponse || !orderResponse.data) {
        const errorMessage = orderResponse?.error?.message || 
                           orderResponse?.error?.error?.message || 
                           JSON.stringify(orderResponse?.error) ||
                           orderResponse?.statusText || 
                           "Unknown error";
        throw new Error(`Failed to create order: ${errorMessage}`);
      }

      setCreatedOrderId(orderId);
      setPaymentError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to create order: ${errorMessage}\n\nCheck the console for more details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white px-8 flex-1 flex items-center justify-center min-h-0 mt-20">
      <div className="w-full my-auto px-10">
        {paymentSuccess ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-4 p-6 bg-green-500/20 border border-green-500 rounded">
              <p className="text-green-400 font-semibold text-2xl mb-2">Payment Successful!</p>
              <p className="text-lg text-white/70">Order ID: {paymentSuccess}</p>
              <p className="text-lg text-white/70 mt-4">Thank you for your purchase!</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-16">
          
          {/* Cart Items */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">Cart Items</h2>
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.documentId}
                  className="flex gap-4 p-4 bg-white/10 rounded-lg relative"
                >
                  <div className="w-24 h-24 shrink-0 rounded overflow-hidden">
                    <StrapiImage
                      src={item.image.url}
                      alt={item.image.alternativeText || item.title}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-lg font-bold">{item.price} SEK</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.documentId)}
                    className="absolute top-2 right-2 text-white"
                    aria-label="Remove item"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total:</span>
                <span>{totalPrice} SEK</span>
              </div>
            </div>
          </div>

          {/* Shipping Form & Payment */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Street Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Sweden"
                />
              </div>

              <div className="mt-6">
                {!createdOrderId ? (
                  <>
                    <p className="text-white/70 mb-4">
                      Fill in your shipping information and create an order to proceed with PayPal payment.*
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating Order..." : "Create Order"}
                    </button>
                  </>
                ) : (
                  <>
                    {paymentSuccess ? (
                      <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded">
                        <p className="text-green-400 font-semibold mb-1">Payment Successful!</p>
                        <p className="text-sm text-white/70">Order ID: {paymentSuccess}</p>
                        <p className="text-sm text-white/70 mt-2">Thank you for your purchase!</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded">
                          <p className="text-green-400 font-semibold mb-1">Order Created!</p>
                          <p className="text-sm text-white/70">Order ID: {createdOrderId}</p>
                          <p className="text-sm text-white/70 mt-2">Complete your payment with PayPal below:</p>
                        </div>
                        {paymentError && (
                          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded">
                            <p className="text-red-400 font-semibold">Payment Error</p>
                            <p className="text-sm text-white/70 mt-1">{paymentError}</p>
                          </div>
                        )}
                        <PayPalButton
                      orderId={createdOrderId}
                      amount={totalPrice}
                      currency="SEK"
                      items={items.map((item) => ({
                        title: item.title,
                        price: item.price,
                        quantity: 1,
                      }))}
                      shippingAddress={{
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                      }}
                      onSuccess={async (orderId) => {
                        setPaymentSuccess(orderId);
                        setPaymentError(null);
                        
                        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
                        const templateId = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID;
                        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

                        if (serviceId && templateId && publicKey) {
                          const orders = items.map(item => ({
                            name: item.title,
                            units: '1',
                            price: `${item.price} SEK`
                          }));

                          emailjs.send(
                            serviceId,
                            templateId,
                            {
                              email: formData.email,
                              order_id: orderId,
                              total_amount: `${totalPrice} SEK`,
                              orders: orders,
                              site_name: 'CINC ART',
                              customer_name: formData.name,
                              shipping_address: formData.address,
                              shipping_city: formData.city,
                              shipping_postal_code: formData.postalCode,
                              shipping_country: formData.country
                            },
                            publicKey
                          ).catch(() => {});
                        }
                      }}
                      onError={(error) => {
                        setPaymentError(error.message || "Payment failed. Please try again.");
                      }}
                      onCancel={() => {
                        setPaymentError("Payment was canceled. You can try again.");
                      }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCreatedOrderId(null);
                            setPaymentError(null);
                          }}
                          className="w-full mt-4 bg-white/10 text-white px-8 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
                        >
                          Cancel & Edit Order
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

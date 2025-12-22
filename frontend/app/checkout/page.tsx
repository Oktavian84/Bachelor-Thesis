"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { StrapiImage } from "@/components/StrapiImage";
import { createOrder } from "@/utils/orders";
import PayPalButton from "@/components/PayPalButton";
import emailjs from "@emailjs/browser";
import { checkoutFormSchema, type CheckoutFormData } from "@/utils/validation";
import { ZodError } from "zod";
import { formatZodErrors } from "@/utils/form-helpers";
import { FormInput } from "@/components/FormInput";

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
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        setErrors({});
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
     
      const validatedData = checkoutFormSchema.parse(formData);

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const orderResponse = await createOrder({
        orderId,
        orderStatus: "pending",
        totalAmount: totalPrice,
        currency: "SEK",
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        shippingAddress: {
          address: validatedData.address,
          city: validatedData.city,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
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
      if (error instanceof ZodError) {
        setErrors(formatZodErrors<CheckoutFormData>(error));
      } else {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        alert(`Failed to create order: ${errorMessage}\n\nCheck the console for more details.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white md:px-8 flex-1 flex items-center justify-center min-h-0 mt-20 xl:mt-10 mb-20 xl:mb-0">
      <div className="w-full my-auto md:px-10 translate-y-12 xl:translate-y-16">
        {paymentSuccess ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-4 p-6 bg-green-500/20 border border-green-500 rounded">
              <p className="text-green-400 font-semibold text-2xl mb-2">Payment Successful!</p>
              <p className="text-lg text-white/70">Order ID: {paymentSuccess}</p>
              <p className="text-lg text-white/70 mt-4">Thank you for your purchase!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row justify-center items-center lg:items-start gap-22 xl:gap-52 px-8">
          
          {/* Cart Items */}
          <div className="w-full xl:w-[60%]">
            <h2 className="text-2xl font-bold text-center mb-6">Cart Items</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="w-full xl:w-[30%]">
            <h2 className="text-2xl font-bold mb-6 text-center">Shipping Information</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <FormInput
                  variant="dark"
                  name="name"
                  value={formData.name}
                  error={errors.name}
                  focusedField={focusedField}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  defaultPlaceholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <FormInput
                  variant="dark"
                  name="email"
                  value={formData.email}
                  error={errors.email}
                  focusedField={focusedField}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  defaultPlaceholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-2">
                  Address
                </label>
                <FormInput
                  variant="dark"
                  name="address"
                  value={formData.address}
                  error={errors.address}
                  focusedField={focusedField}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  defaultPlaceholder="Street Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block mb-2">
                    City
                  </label>
                  <FormInput
                  variant="dark"
                    name="city"
                    value={formData.city}
                    error={errors.city}
                    focusedField={focusedField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    defaultPlaceholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block mb-2">
                    Postal Code
                  </label>
                  <FormInput
                  variant="dark"
                    name="postalCode"
                    value={formData.postalCode}
                    error={errors.postalCode}
                    focusedField={focusedField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    defaultPlaceholder="12345"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="block mb-2">
                  Country
                </label>
                <FormInput
                  variant="dark"
                  name="country"
                  value={formData.country}
                  error={errors.country}
                  focusedField={focusedField}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  defaultPlaceholder="Sweden"
                />
              </div>

              <div className="mt-6">
                <div className="h-[100px] mb-4">
                  {!createdOrderId ? null : (
                    paymentSuccess ? (
                      <div className="p-4 bg-green-500/20 border border-green-500 rounded h-full flex flex-col justify-center">
                        <p className="text-green-400 font-semibold mb-1">Payment Successful!</p>
                        <p className="text-sm text-white/70">Order ID: {paymentSuccess}</p>
                        <p className="text-sm text-white/70 mt-2">Thank you for your purchase!</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-500/20 border border-green-500 rounded h-full flex flex-col justify-center">
                        <p className="text-green-400 font-semibold mb-1">Order Created!</p>
                        <p className="text-sm text-white/70">Order ID: {createdOrderId}</p>
                        <p className="text-sm text-white/70 mt-2">Complete your payment with PayPal below:</p>
                      </div>
                    )
                  )}
                </div>
                <div className="h-[200px]">
                  {!createdOrderId ? (
                    <>
                      <p className="text-white/70 mb-4">
                        Fill in your shipping information and create an order to proceed with PayPal payment.*
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white px-8 py-2 rounded-lg text-xl font-bold border border-white hover:bg-white hover:text-black hover:border-black hover:scale-105 transition-all duration-300 ease-in-out shadow-sm shadow-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? "Creating Order..." : "Create Order"}
                      </button>
                    </>
                  ) : (
                  <>
                    {!paymentSuccess && (
                      <>
                        {paymentError && (
                          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded">
                            <p className="text-red-400 font-semibold">Payment Error</p>
                            <p className="text-sm text-white/70 mt-1">{paymentError}</p>
                          </div>
                        )}
                        <div className="hover:scale-105 transition-all duration-300 ease-in-out rounded-lg overflow-hidden">
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
                        </div>
                      </>
                    )}
                    <div className="min-h-[60px] mt-4">
                      {!paymentSuccess && (
                        <button
                          type="button"
                          onClick={() => {
                            setCreatedOrderId(null);
                            setPaymentError(null);
                          }}
                          className="w-full bg-black text-white px-8 py-2 rounded-lg text-xl font-bold border border-white hover:bg-white hover:text-black hover:border-black hover:scale-105 transition-all duration-300 ease-in-out shadow-sm shadow-white"
                        >
                          Cancel & Edit Order
                        </button>
                      )}
                    </div>
                  </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useCart } from "@/contexts/CartContext";
import { StrapiImage } from "@/components/StrapiImage";

export default function CheckoutPage() {
  const { items, removeItem, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-black text-white flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="bg-black text-white px-8 flex-1 flex items-center justify-center min-h-0 mt-20">
      <div className="w-full my-auto px-10">
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
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
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
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Sweden"
                />
              </div>
            </form>

            <div className="mt-6">
              <p className="text-white/70 mb-4">
                Payment will be processed through PayPal after you submit the order.*
              </p>
              <button
                type="button"
                className="w-full bg-white text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-200 transition-colors"
                disabled
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

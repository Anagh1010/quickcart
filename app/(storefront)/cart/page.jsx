'use client'
import React from "react";
import OrderSummary from "@/components/OrderSummary";
import AuthGate from "@/components/common/AuthGate";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount, currency } = useAppContext();

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 pb-20 pt-8 sm:px-8 md:flex-row xl:px-12 bg-canvas">
      <div className="flex-1">
        {/* Shopping Cart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-border-subtle gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                Shopping Cart
              </h1>
              <span className="rounded-full bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e] border border-[#fde047]">
                READY FOR CHECKOUT
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Review your items and proceed to secure checkout
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-700 bg-white border border-border-subtle rounded-lg px-3 py-1.5 self-start sm:self-auto">
            {getCartCount()} items in cart
          </span>
        </div>

        {/* Cart Items Table */}
        <div className="rounded-2xl border border-border-subtle bg-white p-4 sm:p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-xs">
              <thead className="text-left border-b border-[#f0eee6]">
                <tr>
                  <th className="pb-3 text-stone-500 font-bold uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="pb-3 text-stone-500 font-bold uppercase tracking-wider px-3">
                    Price
                  </th>
                  <th className="pb-3 text-stone-500 font-bold uppercase tracking-wider px-3 text-center">
                    Quantity
                  </th>
                  <th className="pb-3 text-stone-500 font-bold uppercase tracking-wider px-3 text-right">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f0e8]">
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(p => p._id === itemId);

                  if (!product || cartItems[itemId] <= 0) return null;

                  return (
                    <tr key={itemId} className="hover:bg-stone-50/50 transition">
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="size-14 rounded-xl bg-surface-subtle border border-border-subtle p-1.5 flex items-center justify-center shrink-0">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="size-full object-contain"
                              width={60}
                              height={60}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-xs sm:text-sm">{product.name}</p>
                            <span className="font-mono text-[10px] text-stone-500">
                              {product.category || "General"}
                            </span>
                            <div>
                              <button
                                className="text-[11px] font-bold text-stone-400 hover:text-red-600 transition mt-0.5"
                                onClick={() => updateCartQuantity(product._id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-stone-800 font-semibold">
                        {currency}{product.offerPrice}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}
                            className="size-6 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:bg-stone-100 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs">
                            {cartItems[itemId]}
                          </span>
                          <button
                            onClick={() => addToCart(product._id)}
                            className="size-6 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:bg-stone-100 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right font-bold text-stone-900">
                        {currency}{(product.offerPrice * cartItems[itemId]).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f0eee6] flex items-center justify-between">
            <button
              onClick={() => router.push('/all-products')}
              className="flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-stone-950 transition"
            >
              <span>← Continue shopping</span>
            </button>
          </div>
        </div>
      </div>
      <OrderSummary />
    </div>
  );
};

export default function CartPage() {
  return (
    <AuthGate
      title="Sign in to view your cart"
      description="Sign in to review your saved items and proceed to checkout."
    >
      <Cart />
    </AuthGate>
  );
}

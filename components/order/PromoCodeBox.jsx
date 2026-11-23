"use client";

import React from "react";

const PromoCodeBox = ({
  promoCode,
  setPromoCode,
  appliedCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
  isApplying,
  currency,
}) => {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
        Promo / Coupon Code
      </label>
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-[#fef08a] border border-[#fde047] rounded-xl p-3">
          <div>
            <p className="text-xs font-bold text-[#713f12]">COUPON APPLIED: {appliedCoupon.code}</p>
            <p className="text-[11px] text-[#854d0e] font-medium">
              {appliedCoupon.discountType === "percentage"
                ? `${appliedCoupon.discountValue}% Off your order`
                : `${currency}${appliedCoupon.discountValue} Flat Discount`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. SAVE20, FREESHIP"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full text-xs p-2.5 text-stone-800 border border-border-subtle rounded-xl bg-white focus:border-stone-400 outline-none uppercase placeholder:normal-case font-mono"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={isApplying}
            className="bg-stone-900 text-white text-xs px-4 py-2.5 hover:bg-stone-800 rounded-xl font-bold cursor-pointer transition disabled:opacity-50 shrink-0"
          >
            {isApplying ? "..." : "Apply"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PromoCodeBox;

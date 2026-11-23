"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";

const CATEGORIES = [
  { name: "Earphone", slot: "CAT 01" },
  { name: "Headphone", slot: "CAT 01" },
  { name: "Laptop", slot: "CAT 02" },
  { name: "Console", slot: "CAT 03" },
  { name: "Camera", slot: "CAT 04" },
  { name: "Watch", slot: "CAT 05" },
  { name: "Mobile", slot: "CAT 06" },
];

const CatalogSidebar = ({
  cartCount,
  router,
  clearFilters,
  selectedCategories,
  handleCategoryChange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handlePriceChangeSubmit,
}) => {
  const { user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <aside className="w-full md:w-72 shrink-0 space-y-5">
      {/* Dark Cart Overview Panel in Screenshot 2 Style */}
      <div className="rounded-2xl border border-stone-800 bg-[#141518] p-5 text-white shadow-sm space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            SHOPPING BAG
          </p>
          <h2 className="text-base font-bold text-white mt-1">Order Overview</h2>
          <p className="font-mono text-xs text-stone-400">QUICKCART VERIFIED</p>
        </div>

        {/* Items Counter with Progress Segments */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              {cartCount} <span className="text-xs text-stone-400 font-normal">/ 10 items</span>
            </span>
            <span className="text-[10px] font-bold text-[#f5c344]">
              {cartCount > 0 ? "✓ ITEMS ADDED" : "BAG EMPTY"}
            </span>
          </div>
          {/* Segmented Progress Bar */}
          <div className="flex gap-1 h-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-xs transition-colors ${
                  i < cartCount ? "bg-[#f5c344]" : "bg-stone-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next Steps CTA Button */}
        <div className="pt-2 border-t border-stone-800">
          <p className="text-[10px] text-stone-400 font-medium mb-2">
            {cartCount > 0
              ? "■ Ready to proceed to checkout"
              : "■ Add products to build your order"}
          </p>
          <button
            onClick={() => (user ? router.push("/cart") : openSignIn({ fallbackRedirectUrl: "/cart" }))}
            className="w-full rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] py-2.5 px-4 text-xs font-bold text-stone-950 transition shadow-sm"
          >
            Review and checkout →
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceae3]">
          <h3 className="text-sm font-bold text-stone-900">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-[#854d0e] hover:text-amber-800 transition"
          >
            Reset All
          </button>
        </div>

        {/* Categories */}
        <div>
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
            Categories
          </p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.name}
                className="flex items-center justify-between text-xs font-medium text-stone-700 hover:text-stone-950 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                    className="size-3.5 rounded border-stone-300 accent-[#f5c344] cursor-pointer"
                  />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono text-[10px] text-stone-400">{cat.slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
            Price Range ($)
          </p>
          <form onSubmit={handlePriceChangeSubmit} className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-lg border border-[#e6e4dc] bg-[#f8f7f2] px-2.5 py-1.5 text-xs outline-none text-center"
            />
            <span className="text-xs text-stone-400">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-lg border border-[#e6e4dc] bg-[#f8f7f2] px-2.5 py-1.5 text-xs outline-none text-center"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#f5c344] hover:bg-[#e6b02e] px-3 py-1.5 text-xs font-bold text-stone-950 transition"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default CatalogSidebar;

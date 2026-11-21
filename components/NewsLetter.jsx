"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed! Check your inbox for your 20% discount code.");
    setEmail("");
  };

  return (
    <section className="py-12">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center px-5 sm:px-8 xl:px-12">
        <div className="w-full max-w-3xl rounded-2xl border border-[#e6e4dc] bg-white p-8 md:p-12 text-center shadow-2xs">
          <span className="rounded-full bg-[#fef08a] px-3 py-1 font-mono text-[10px] font-bold text-[#854d0e] uppercase tracking-wider border border-[#fde047]">
            INSIDER DEALS & DROPS
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Subscribe & get 20% off your order
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Be the first to hear about new arrivals, flash discounts, and limited-edition product drops.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto w-full"
            suppressHydrationWarning
          >
            <input
              className="h-11 w-full rounded-xl border border-[#e6e4dc] bg-[#f8f7f2] px-4 text-xs text-stone-900 outline-none focus:border-stone-400 focus:bg-white placeholder:text-stone-400 transition"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="h-11 w-full sm:w-auto shrink-0 rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-6 text-xs font-bold text-stone-950 transition shadow-2xs"
            >
              Subscribe & Save
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;

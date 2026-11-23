"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutContainer from "@/components/layout/LayoutContainer";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryImage";

const HomeHeroSlider = ({ products }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedId, setCopiedId] = useState(false);

  const slides = useMemo(() => {
    const findProduct = (terms) => products.find((product) => terms.some((term) => product.name.toLowerCase().includes(term)));

    return [
      {
        id: "macbook",
        eyebrow: "FEATURED FLAGSHIP PRODUCT",
        name: "MacBook Pro 16″ M3 Max",
        code: "QC-MBP16-M3MAX",
        tag1: "16.2″ Liquid Retina XDR",
        tag2: "36GB Unified Memory",
        tag3: "1TB Ultra-Fast SSD",
        badge: "LIMITED TIME OFFER",
        session: "Save 40% On MacBook Pro",
        status: "● In stock for express delivery",
        cta: "Shop MacBook Pro →",
        product: findProduct(["macbook", "pro 16"]),
        fallbackImage: "/assets/header_macbook_image.png",
      },
      {
        id: "playstation",
        eyebrow: "NEXT-GEN GAMING RIG",
        name: "PlayStation 5 Digital Edition",
        code: "QC-PS5-DIGITAL",
        tag1: "Ultra-High Speed SSD",
        tag2: "Ray Tracing 4K 120Hz",
        tag3: "DualSense Wireless",
        badge: "SPECIAL PROMOTION",
        session: "Next-Level Gaming Starts Here",
        status: "● Limited stock available",
        cta: "Shop PlayStation 5 →",
        product: findProduct(["playstation", "ps5"]),
        fallbackImage: "/assets/header_playstation_image.png",
      },
      {
        id: "samsung",
        eyebrow: "FLAGSHIP SMARTPHONE",
        name: "Samsung Galaxy S25 Ultra 5G",
        code: "QC-S25-ULTRA",
        tag1: "Dynamic AMOLED 2X",
        tag2: "Snapdragon 8 Elite",
        tag3: "200MP Quad Tele System",
        badge: "FLASH DISCOUNT",
        session: "$100 Instant Savings Today",
        status: "● Same-day dispatch available",
        cta: "Shop Galaxy S25 →",
        product: findProduct(["samsung", "s23", "s25"]),
        fallbackImage: "/assets/samsung_s23phone_image.png",
      },
    ];
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const openProduct = (item) => {
    router.push(item.product ? `/product/${item.product._id}` : "/all-products");
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section aria-label="Featured Offers" className="pt-6 sm:pt-8">
      <LayoutContainer size="wide">
        {/* Dark Hero Card Banner */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-dark-surface text-white p-6 sm:p-8 md:p-10 border border-stone-800 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Side: Product Profile */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar / Product Badge */}
              <div className="relative size-24 sm:size-28 shrink-0 rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center overflow-hidden">
                <Image
                  src={getCloudinaryImageUrl(slide.product?.image?.[0] || slide.fallbackImage, 400)}
                  alt={slide.name}
                  width={200}
                  height={200}
                  priority
                  className="size-full object-contain"
                  unoptimized={Boolean(slide.product?.image?.[0])}
                />
              </div>

              {/* Profile Details */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                  {slide.eyebrow}
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  {slide.name}
                </h1>

                {/* SKU Code with Copy Icon */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-stone-300 font-semibold">{slide.code}</span>
                  <button
                    onClick={() => copyCode(slide.code)}
                    className="rounded p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition"
                    title="Copy SKU"
                  >
                    <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {copiedId && <span className="text-[10px] text-[#f5c344] font-medium">Copied!</span>}
                </div>

                {/* Dark Translucent Pill Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="rounded-full border border-stone-700/80 bg-[#22242a] px-3 py-0.5 text-xs font-medium text-stone-300">
                    {slide.tag1}
                  </span>
                  <span className="rounded-full border border-stone-700/80 bg-[#22242a] px-3 py-0.5 text-xs font-medium text-stone-300">
                    {slide.tag2}
                  </span>
                  <span className="rounded-full border border-stone-700/80 bg-[#22242a] px-3 py-0.5 text-xs font-medium text-stone-300">
                    {slide.tag3}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Promotion Action Box */}
            <div className="flex flex-col gap-2 rounded-2xl bg-[#1c1d22] border border-stone-800 p-5 sm:min-w-[300px] shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                {slide.badge}
              </span>
              <p className="text-base font-bold text-white">{slide.session}</p>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="text-amber-400 text-xs">■</span>
                <span>{slide.status}</span>
              </div>
              <button
                onClick={() => openProduct(slide)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] py-3 px-6 text-sm font-bold text-stone-950 transition shadow-sm"
              >
                {slide.cta}
              </button>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <span className="font-mono text-[11px]">FEATURED {currentSlide + 1} OF {slides.length}</span>
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? "w-6 bg-[#f5c344]" : "w-2 bg-stone-700 hover:bg-stone-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </LayoutContainer>
    </section>
  );
};

export default HomeHeroSlider;

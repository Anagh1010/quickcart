'use client'
import heart_icon from "@/assets/heart_icon.svg";
import star_icon from "@/assets/star_icon.svg";
import star_dull_icon from "@/assets/star_dull_icon.svg";

import React from 'react'
import { getCloudinaryImageUrl } from '@/lib/cloudinaryImage';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product, loadEagerly }) => {
    const { currency, router } = useAppContext()

    const avgRating = product.avgRating !== undefined ? Number(product.avgRating) : 0;
    const totalReviews = product.totalReviews !== undefined ? Number(product.totalReviews) : 0;
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 5;

    const codeTag = product.category
        ? `#${product.category.slice(0, 3).toUpperCase()}-${product._id.slice(-3).toUpperCase()}`
        : "#QC-ITEM";

    return (
        <div
            onClick={() => router.push('/product/' + product._id)}
            className="group flex flex-col justify-between rounded-2xl border border-[#e6e4dc] bg-white p-3.5 hover:border-stone-400 hover:shadow-xs transition duration-200 cursor-pointer w-full"
        >
            <div>
                {/* Image Surface with Badges */}
                <div className="relative w-full h-48 rounded-xl bg-[#f8f7f2] flex items-center justify-center overflow-hidden p-3">
                    {/* Status Pill Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                        {isOutOfStock ? (
                            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-700 uppercase tracking-wide">
                                Out of Stock
                            </span>
                        ) : isLowStock ? (
                            <span className="rounded-full bg-[#fef08a] px-2 py-0.5 text-[10px] font-bold text-[#854d0e] uppercase tracking-wide border border-[#fde047]">
                                Only {product.stock} Left
                            </span>
                        ) : (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                                ✓ In Stock
                            </span>
                        )}
                    </div>

                    <Image
                        src={getCloudinaryImageUrl(product.image[0], 400)}
                        alt={product.name}
                        className={`object-contain max-h-40 max-w-full transition duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                        width={400}
                        height={400}
                        loading={loadEagerly ? 'eager' : 'lazy'}
                        sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 240px"
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="absolute top-2.5 right-2.5 bg-white p-1.5 rounded-full border border-stone-200 shadow-2xs z-10 hover:bg-stone-50 transition"
                        aria-label="Save item"
                    >
                        <Image
                            className="size-3.5 opacity-70"
                            src={heart_icon}
                            alt="heart_icon"
                        />
                    </button>
                </div>

                {/* SKU Code & Category Tag */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="rounded bg-[#fef08a] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#854d0e]">
                        {codeTag}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        {product.category || "General"}
                    </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-stone-900 line-clamp-1 mt-1 group-hover:text-amber-800 transition">
                    {product.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {product.description}
                </p>

                {/* Dynamic Star Ratings */}
                <div className="flex items-center gap-1.5 pt-2">
                    <span className="text-xs font-mono font-bold text-stone-800">
                        {avgRating > 0 ? avgRating.toFixed(1) : "4.8"}
                    </span>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Image
                                key={index}
                                className="size-2.5"
                                src={index < Math.floor(avgRating || 4.5) ? star_icon : star_dull_icon}
                                alt="star"
                                width={10}
                                height={10}
                            />
                        ))}
                    </div>
                    {totalReviews > 0 && (
                        <span className="text-[10px] text-stone-400 font-medium">({totalReviews})</span>
                    )}
                </div>
            </div>

            {/* Bottom Row: Price & Add Button */}
            <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-[#f0eee6]">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Price</span>
                    <span className="text-base font-bold text-stone-900">{currency}{product.offerPrice}</span>
                </div>
                <button
                    disabled={isOutOfStock}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isOutOfStock
                            ? 'text-stone-400 border border-stone-200 cursor-not-allowed bg-stone-100'
                            : 'text-stone-900 border border-stone-300 bg-white hover:bg-[#f5c344] hover:border-[#f5c344] shadow-2xs'
                    }`}
                >
                    {isOutOfStock ? "Out of Stock" : "+ Add to Cart"}
                </button>
            </div>
        </div>
    )
}

export default ProductCard;

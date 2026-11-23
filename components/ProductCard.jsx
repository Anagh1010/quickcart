'use client'
import star_icon from "@/assets/star_icon.svg";
import star_dull_icon from "@/assets/star_dull_icon.svg";

import React from 'react'
import { getCloudinaryImageUrl } from '@/lib/cloudinaryImage';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product, loadEagerly }) => {
    const { currency, router, addToCart } = useAppContext()

    const avgRating = product.avgRating !== undefined ? Number(product.avgRating) : 0;
    const totalReviews = product.totalReviews !== undefined ? Number(product.totalReviews) : 0;
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 5;

    const hasDiscount = Number(product.price) > Number(product.offerPrice);
    const discountPct = hasDiscount
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

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
                                In Stock
                            </span>
                        )}
                    </div>

                    {hasDiscount && discountPct > 0 && !isOutOfStock && (
                        <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-[#141518] px-2 py-0.5 text-[10px] font-bold text-[#f5c344] tracking-wide">
                            {discountPct}% OFF
                        </span>
                    )}

                    <Image
                        src={getCloudinaryImageUrl(product.image[0], 400)}
                        alt={product.name}
                        className={`object-contain max-h-40 max-w-full transition duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                        width={400}
                        height={400}
                        loading={loadEagerly ? 'eager' : 'lazy'}
                        sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 240px"
                    />
                </div>

                {/* Category Tag */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
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
                    {totalReviews > 0 && avgRating > 0 ? (
                        <>
                            <span className="text-xs font-mono font-bold text-stone-800">
                                {avgRating.toFixed(1)}
                            </span>
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Image
                                        key={index}
                                        className="size-2.5"
                                        src={index < Math.floor(avgRating) ? star_icon : star_dull_icon}
                                        alt="star"
                                        width={10}
                                        height={10}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-stone-400 font-medium">({totalReviews})</span>
                        </>
                    ) : (
                        <span className="text-[11px] text-stone-400 font-medium">No reviews yet</span>
                    )}
                </div>
            </div>

            {/* Bottom Row: Price & Add Button */}
            <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-[#f0eee6]">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Price</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-stone-900">{currency}{product.offerPrice}</span>
                        {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">{currency}{product.price}</span>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product._id);
                    }}
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

export default React.memo(ProductCard);

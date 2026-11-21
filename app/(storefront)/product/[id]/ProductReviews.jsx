"use client";

import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";

const ProductReviews = ({
  reviews,
  stats,
  reviewsLoading,
  handleReviewSubmit,
  isPending,
  user,
}) => {
  return (
    <div className="rounded-2xl border border-[#e6e4dc] bg-white p-6 md:p-8 shadow-2xs grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left Column: Star Breakdown & Review Form */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-2">Customer Reviews</h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                className="size-4"
                src={index < Math.floor(stats.avgRating || 4.5) ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
          </div>
          <span className="text-sm font-mono font-bold text-stone-900">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "4.8"} / 5.0
          </span>
        </div>

        {/* Progress Breakdown */}
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.starBreakdown[star] || 0;
            const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center text-xs gap-3">
                <span className="w-12 text-stone-500 font-medium">{star} star</span>
                <div className="w-full bg-[#f8f7f2] h-2 rounded-full overflow-hidden border border-[#e6e4dc]">
                  <div
                    className="bg-[#f5c344] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-stone-400 font-mono text-right">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>

        {/* Review Form */}
        {user ? (
          <form action={handleReviewSubmit} className="mt-6 border-t border-[#f0eee6] pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Write a Review
            </h4>
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                Rating
              </label>
              <select
                name="rating"
                className="w-full rounded-xl border border-[#e6e4dc] bg-[#f8f7f2] px-3 py-2 text-xs font-medium text-stone-800 outline-none focus:border-stone-400"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                <option value="3">⭐⭐⭐ 3 - Average</option>
                <option value="2">⭐⭐ 2 - Below Average</option>
                <option value="1">⭐ 1 - Poor</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                Review Comment
              </label>
              <textarea
                name="comment"
                placeholder="What did you like or dislike about this product?"
                rows="3"
                className="w-full rounded-xl border border-[#e6e4dc] bg-[#f8f7f2] px-3 py-2 text-xs text-stone-800 outline-none focus:border-stone-400 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-stone-900 hover:bg-stone-800 py-2.5 text-xs font-bold text-white transition shadow-2xs"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mt-6 border-t border-[#f0eee6] pt-5 text-center">
            <p className="text-xs text-stone-500">Sign in to write a product review.</p>
          </div>
        )}
      </div>

      {/* Right Column: Customer Reviews Listing */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h3 className="text-base font-bold text-stone-900 border-b border-[#f0eee6] pb-3">
          Verified Reviews ({reviews.length})
        </h3>
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-6">
            No customer reviews for this product yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="flex flex-col gap-4 divide-y divide-[#f2f0e8] max-h-[480px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div key={rev._id} className="pt-4 first:pt-0">
                <div className="flex items-center gap-3 mb-1.5">
                  {rev.userImage ? (
                    <Image
                      src={rev.userImage}
                      alt="avatar"
                      className="size-7 rounded-full border border-stone-200"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-[#fef08a] text-[11px] font-bold text-[#854d0e]">
                      {rev.userName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{rev.userName}</h5>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Image
                            key={i}
                            className="size-2.5"
                            src={i < rev.rating ? assets.star_icon : assets.star_dull_icon}
                            alt="star"
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-stone-400">
                        {new Date(rev.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {rev.isVerified && (
                  <span className="inline-flex items-center rounded bg-[#fef08a] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#854d0e] uppercase tracking-wider mb-1">
                    ✓ Verified Purchase
                  </span>
                )}
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

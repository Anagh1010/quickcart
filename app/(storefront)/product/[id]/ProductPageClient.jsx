"use client"
import star_icon from "@/assets/star_icon.svg";
import star_dull_icon from "@/assets/star_dull_icon.svg";
import React, { useEffect, useState, useTransition } from "react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useClerk } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import { getCloudinaryImageUrl } from "@/lib/cloudinaryImage";
import ProductReviews from "./ProductReviews";

const Product = ({ initialProduct }) => {
    const id = initialProduct._id;
    const { router, addToCart, user, currency } = useAppContext();
    const { openSignIn } = useClerk();

    const [mainImage, setMainImage] = useState(null);
    const productData = initialProduct;
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0, starBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await fetch(`/api/review/list?productId=${id}`);
            if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
                const data = await res.json();
                if (data.success) {
                    setReviews(data.reviews);
                    setStats(data.stats);
                }
            } else {
                throw new Error("Invalid server reviews response");
            }
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        setMainImage(null);
        fetchReviews();
    }, [id]);

    useEffect(() => {
        if (!productData) return;

        fetch(`/api/product/list?category=${encodeURIComponent(productData.category)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRelatedProducts(data.products.filter((p) => p._id !== productData._id).slice(0, 5));
                }
            })
            .catch((error) => {
                console.error("Failed to load related products:", error);
            });
    }, [productData]);

    const handleReviewSubmit = async (formData) => {
        const rating = formData.get("rating");
        const comment = formData.get("comment");

        if (!rating || !comment) {
            alert("Please provide both a star rating and a review comment.");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/review/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: id,
                        rating: Number(rating),
                        comment,
                        userName: user?.fullName || user?.firstName || "Verified Customer",
                        userImage: user?.imageUrl || ""
                    })
                });
                const data = await res.json();
                if (data.success) {
                    fetchReviews();
                } else {
                    alert(data.message);
                }
            } catch (err) {
                alert("Failed to submit review. Please try again.");
            }
        });
    };

    if (!productData) return <Loading />;

    const isOutOfStock = productData.stock === 0;
    const isLowStock = productData.stock > 0 && productData.stock < 5;

    return (
        <div className="min-h-screen space-y-10 bg-[#fbf9f4] px-5 pb-16 pt-8 text-stone-900 sm:px-8 xl:px-12">
            {/* 1. Main Info Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 rounded-2xl border border-[#e6e4dc] bg-white p-6 md:p-8 shadow-2xs">
                {/* Left Frame: Images Showcase */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl overflow-hidden bg-[#f8f7f2] flex items-center justify-center p-6 border border-[#e6e4dc]">
                        <Image
                            src={getCloudinaryImageUrl(mainImage || productData.image[0], 1000)}
                            alt={productData.name}
                            className="w-full max-h-80 object-contain"
                            width={1280}
                            height={720}
                            priority
                            unoptimized
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`cursor-pointer rounded-lg overflow-hidden bg-[#f8f7f2] p-2 border transition ${
                                    mainImage === image
                                        ? 'border-[#f5c344] ring-2 ring-[#fef08a]'
                                        : 'border-[#e6e4dc] hover:border-stone-400'
                                }`}
                            >
                                <Image
                                    src={getCloudinaryImageUrl(image, 200)}
                                    alt="thumbnail"
                                    className="w-full h-auto object-contain max-h-14"
                                    width={1280}
                                    height={720}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Frame: Specifications & Actions */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="rounded bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e] border border-[#fde047]">
                                {productData.category?.toUpperCase() || "TECH"}
                            </span>
                            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                                GENUINE HARDWARE
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-2">
                            {productData.name}
                        </h1>

                        {/* Live Star Ratings */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Image
                                        key={index}
                                        className="size-3.5"
                                        src={index < Math.floor(stats.avgRating || 4.5) ? star_icon : star_dull_icon}
                                        alt="star"
                                        width={14}
                                        height={14}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-mono font-bold text-stone-800">
                                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "4.8"}
                            </span>
                            <span className="text-stone-400 text-xs font-medium">• {stats.totalReviews} customer reviews</span>
                        </div>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                            {productData.description}
                        </p>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-2xl sm:text-3xl font-bold text-stone-900">{currency}{productData.offerPrice}</span>
                            <span className="text-sm text-stone-400 line-through">{currency}{productData.price}</span>
                            <span className="rounded-full bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e]">
                                SPECIAL DEAL
                            </span>
                        </div>

                        {/* Product Specifications Table */}
                        <div className="rounded-xl border border-[#eceae3] bg-[#f8f7f2] p-4 mb-6">
                            <div className="divide-y divide-[#eceae3] text-xs">
                                <div className="flex justify-between py-2">
                                    <span className="text-stone-500 font-medium">Category</span>
                                    <span className="text-stone-900 font-bold">{productData.category}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-stone-500 font-medium">Stock Availability</span>
                                    {isOutOfStock ? (
                                        <span className="text-stone-500 font-bold uppercase text-[11px]">Out of Stock</span>
                                    ) : isLowStock ? (
                                        <span className="text-[#854d0e] font-bold text-[11px]">Only {productData.stock} units remaining</span>
                                    ) : (
                                        <span className="text-emerald-700 font-bold text-[11px]">In Stock ({productData.stock} available)</span>
                                    )}
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-stone-500 font-medium">Delivery</span>
                                    <span className="text-stone-900 font-bold">Free Shipping on orders over $50</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            disabled={isOutOfStock}
                            onClick={() => addToCart(productData._id)}
                            className={`w-full py-3 rounded-xl font-bold transition text-xs border border-stone-300 ${
                                isOutOfStock
                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    : 'bg-white text-stone-800 hover:bg-stone-50'
                            }`}
                        >
                            + Add to Cart
                        </button>
                        <button
                            disabled={isOutOfStock}
                            onClick={() => {
                                if (!user) return openSignIn({ fallbackRedirectUrl: '/cart' });
                                addToCart(productData._id);
                                router.push('/cart');
                            }}
                            className={`w-full py-3 rounded-xl font-bold transition text-xs ${
                                isOutOfStock
                                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    : 'bg-[#f5c344] hover:bg-[#e6b02e] text-stone-950 shadow-sm'
                            }`}
                        >
                            Buy Now →
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Customer Reviews Component */}
            <ProductReviews
                reviews={reviews}
                stats={stats}
                reviewsLoading={reviewsLoading}
                handleReviewSubmit={handleReviewSubmit}
                isPending={isPending}
                user={user}
            />

            {/* 3. Related Products Grid */}
            <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-stone-900">Similar products you may like</h2>
                        <span className="rounded-md bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e]">
                            RECOMMENDED
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {relatedProducts.map((p) => (
                        <ProductCard key={p._id} product={p} loadEagerly={false} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Product;

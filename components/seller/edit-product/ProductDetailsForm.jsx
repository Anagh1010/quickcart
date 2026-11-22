'use client'
import React from 'react'

const CATEGORIES = ["Earphone", "Headphone", "Watch", "Mobile", "Laptop", "Camera", "Console"];

export default function ProductDetailsForm({
    name, setName,
    description, setDescription,
    category, setCategory,
    price, setPrice,
    offerPrice, setOfferPrice,
    stock, setStock,
    isSubmitting,
    onCancel
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-name">
                    Product Name
                </label>
                <input
                    id="product-name"
                    type="text"
                    placeholder="Product Title"
                    className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-description">
                    Description
                </label>
                <textarea
                    id="product-description"
                    rows={3}
                    className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 resize-none leading-relaxed text-xs"
                    placeholder="Tell buyers about your product..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs cursor-pointer"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-stock">
                        Live Stock
                    </label>
                    <input
                        id="product-stock"
                        type="number"
                        placeholder="0"
                        className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                        min="0"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="product-price">
                        Base Price ($)
                    </label>
                    <input
                        id="product-price"
                        type="number"
                        placeholder="0"
                        className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        min="1"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="offer-price">
                        Offer Price ($)
                    </label>
                    <input
                        id="offer-price"
                        type="number"
                        placeholder="0"
                        className="outline-none py-2.5 px-3.5 rounded-xl border border-[#e6e4dc] bg-white font-medium text-stone-800 focus:border-amber-500 text-xs"
                        onChange={(e) => setOfferPrice(e.target.value)}
                        value={offerPrice}
                        min="1"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition cursor-pointer text-xs"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#f5c344] hover:bg-[#e6b02e] text-stone-900 rounded-xl font-bold transition shadow-2xs cursor-pointer disabled:opacity-50 text-xs"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    )
}

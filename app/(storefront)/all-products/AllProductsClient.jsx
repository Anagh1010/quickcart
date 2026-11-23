'use client'
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import CatalogSidebar from "./CatalogSidebar";

const AllProductsContent = ({ initialProducts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCartCount } = useAppContext();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialInStock = searchParams.get("inStock") === "true";
  const initialSort = searchParams.get("sort") || "newest";

  const products = initialProducts;
  const cartCount = getCartCount ? getCartCount() : 0;

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? initialCategory.split(",") : []
  );
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [inStock, setInStock] = useState(initialInStock);
  const [sort, setSort] = useState(initialSort);

  const applyFilters = (categories, minP, maxP, stock, sorting, search = searchInput) => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.set("search", search.trim());
    if (categories && categories.length > 0) params.set("category", categories.join(","));
    if (minP) params.set("minPrice", minP);
    if (maxP) params.set("maxPrice", maxP);
    if (stock) params.set("inStock", "true");
    if (sorting) params.set("sort", sorting);
    router.push(`/all-products?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (catName) => {
    const nextCategories = selectedCategories.includes(catName)
      ? selectedCategories.filter((c) => c !== catName)
      : [...selectedCategories, catName];
    setSelectedCategories(nextCategories);
    applyFilters(nextCategories, minPrice, maxPrice, inStock, sort);
  };

  const handlePriceChangeSubmit = (e) => {
    e.preventDefault();
    applyFilters(selectedCategories, minPrice, maxPrice, inStock, sort);
  };

  const handleStockToggle = () => {
    const nextInStock = !inStock;
    setInStock(nextInStock);
    applyFilters(selectedCategories, minPrice, maxPrice, nextInStock, sort);
  };

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    setSort(nextSort);
    applyFilters(selectedCategories, minPrice, maxPrice, inStock, nextSort);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters(selectedCategories, minPrice, maxPrice, inStock, sort, searchInput);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setSort("newest");
    router.push("/all-products", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] px-5 py-8 text-stone-900 sm:px-8 xl:px-12">
      {/* Top Search & Filter Bar (Matching Screenshot 2 Style) */}
      <div className="mx-auto max-w-[1440px] mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-2xs">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-3 w-full">
            <svg className="size-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search products by name, code or category..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent text-xs text-stone-900 outline-none placeholder:text-stone-400"
            />
            <kbd className="hidden sm:inline-block rounded border border-stone-200 bg-stone-100 px-2 py-0.5 text-[10px] font-mono text-stone-500">
              /
            </kbd>
          </form>
          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eceae3]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none">
              <input
                type="checkbox"
                checked={inStock}
                onChange={handleStockToggle}
                className="size-4 rounded border-stone-300 accent-[#f5c344] cursor-pointer"
              />
              Available only
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-stone-500">Sort:</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="rounded-xl border border-stone-300 bg-[#f8f7f2] px-3 py-1.5 text-xs font-semibold text-stone-800 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Panel & Right Catalog */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row items-start">
        <CatalogSidebar
          cartCount={cartCount}
          router={router}
          clearFilters={clearFilters}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          handlePriceChangeSubmit={handlePriceChangeSubmit}
        />

        {/* Right Side: Products Catalog */}
        <main className="w-full flex-1">
          <div className="flex items-center justify-between rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-2xs mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold text-stone-900">
                {initialSearch ? `Search results for "${initialSearch}"` : "All Products"}
              </h1>
              <span className="rounded-full bg-[#fef08a] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#854d0e] border border-[#fde047]">
                ✓ {products.length} {products.length === 1 ? "ITEM" : "ITEMS"} AVAILABLE
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Genuine Products · Fast Delivery</p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-[#e6e4dc] bg-white p-12 text-center shadow-2xs">
              <h2 className="text-base font-bold text-stone-900">No products found</h2>
              <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
                Try loosening your filter parameters, resetting price limits, or exploring other categories.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-5 py-2.5 text-xs font-bold text-stone-950 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-16">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} loadEagerly={index < 4} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const AllProducts = ({ initialProducts }) => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center bg-[#fbf9f4]">
        <Loading />
      </div>
    }
  >
    <AllProductsContent initialProducts={initialProducts} />
  </Suspense>
);

export default AllProducts;

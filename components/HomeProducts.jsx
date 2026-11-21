"use client";

import Link from "next/link";
import React from "react";
import ProductCard from "./ProductCard";
import SectionHeading from "@/components/layout/SectionHeading";
import LayoutContainer from "@/components/layout/LayoutContainer";

const HomeProducts = ({ products }) => {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="FEATURED PRODUCTS"
        title="Trending this week"
        badge="TOP RATED"
        description="Fresh arrivals and customer favorites backed by verified reviews and fast shipping."
        action={
          <Link
            className="flex items-center gap-2 rounded-xl border border-[#e6e4dc] bg-white px-5 py-2.5 text-xs font-bold text-stone-800 hover:border-stone-400 hover:bg-stone-50 transition shadow-2xs"
            href="/all-products"
          >
            <span>View all products</span>
            <span className="text-stone-400">→</span>
          </Link>
        }
      />
      <LayoutContainer size="wide" className="mt-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              loadEagerly={index < 5}
            />
          ))}
        </div>
      </LayoutContainer>
    </section>
  );
};

export default HomeProducts;

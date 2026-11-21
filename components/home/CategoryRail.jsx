"use client";

import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/layout/SectionHeading";

const categories = [
  { filter: "Headphone,Earphone", image: "/assets/apple_earphone_image.png", name: "Audio", slot: "CAT 01", count: "14 items" },
  { filter: "Laptop", image: "/assets/macbook_image.png", name: "Computing", slot: "CAT 02", count: "28 items" },
  { filter: "Console", image: "/assets/md_controller_image.png", name: "Gaming", slot: "CAT 03", count: "9 items" },
  { filter: "Camera", image: "/assets/cannon_camera_image.png", name: "Photography", slot: "CAT 04", count: "6 items" },
  { filter: "Watch", image: "/assets/venu_watch_image.png", name: "Wearables", slot: "CAT 05", count: "11 items" },
];

const getCategoryHref = (filter) => `/all-products?category=${encodeURIComponent(filter)}&sort=newest`;

const CategoryRail = () => (
  <section className="py-12">
    <SectionHeading
      eyebrow="SHOP BY CATEGORY"
      title="Explore collections"
      badge="TOP CATEGORIES"
      description="Find the gear you need across computing, studio sound, gaming rigs, and wearables."
    />
    <div className="mx-auto mt-6 grid w-full max-w-[1440px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 xl:px-12">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={getCategoryHref(category.filter)}
          className="group flex flex-col justify-between rounded-2xl border border-[#e6e4dc] bg-white p-5 hover:border-stone-400 hover:shadow-xs transition duration-200"
        >
          {/* Category Slot Badge */}
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-[#fef08a] px-2 py-0.5 font-mono text-[11px] font-bold text-[#854d0e] border border-[#fde047]">
              {category.slot}
            </span>
            <span className="text-[11px] font-medium text-stone-500">{category.count}</span>
          </div>

          {/* Product Image */}
          <div className="my-4 flex h-32 items-center justify-center rounded-xl bg-[#f8f7f2] p-3">
            <Image
              alt={category.name}
              className="max-h-24 max-w-24 object-contain transition duration-200 group-hover:scale-105"
              height={140}
              src={category.image}
              width={140}
            />
          </div>

          {/* Title & Chevron */}
          <div className="flex items-center justify-between border-t border-[#f0eee6] pt-3">
            <div>
              <p className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition">
                {category.name}
              </p>
              <p className="text-[11px] text-stone-500">In stock & ready to ship</p>
            </div>
            <span className="text-stone-400 group-hover:text-stone-800 transition">→</span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryRail;

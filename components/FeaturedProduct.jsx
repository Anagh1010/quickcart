import React from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/layout/SectionHeading";

const collections = [
  {
    id: 1,
    image: "/assets/girl_with_headphone_image.png",
    code: "CAT AU-01",
    title: "Unparalleled Studio Sound",
    description: "High-fidelity audio monitors engineered for music production, gaming, and everyday listening.",
  },
  {
    id: 2,
    image: "/assets/girl_with_earphone_image.png",
    code: "CAT AU-02",
    title: "Active Noise-Cancelling Buds",
    description: "Compact wireless earbuds for travel, workout sessions, and crystal-clear calls on the move.",
  },
  {
    id: 3,
    image: "/assets/boy_with_laptop_image.png",
    code: "CAT PC-03",
    title: "Pro Computing & Laptops",
    description: "High-efficiency laptops and workstations tested for intensive creative workflows and coding.",
  },
];

const FeaturedProduct = () => {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="CURATED COLLECTIONS"
        title="Designed for modern life"
        badge="2026 EDITION"
        description="Thoughtfully curated gear to elevate your desktop, audio experience, and everyday carry."
      />

      <div className="mx-auto mt-6 grid w-full max-w-[1440px] grid-cols-1 gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:px-12">
        {collections.map(({ id, image, code, title, description }) => (
          <article key={id} className="group relative min-h-80 overflow-hidden rounded-2xl md:rounded-3xl bg-dark-surface border border-stone-800 shadow-sm">
            <Image
              fill
              src={image}
              alt={title}
              sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(50vw - 2.625rem), (max-width: 1279px) calc(33.333vw - 2.167rem), (max-width: 1439px) calc(33.333vw - 2.833rem), 27.2rem"
              className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-surface via-dark-surface/80 to-transparent p-6 pt-20 text-white">
              <span className="rounded bg-[#fef08a] px-2 py-0.5 font-mono text-[10px] font-bold text-[#854d0e] border border-[#fde047]">
                {code}
              </span>
              <h3 className="mt-2 text-lg font-bold lg:text-xl text-white">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-stone-300">{description}</p>
              <Link
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f5c344] hover:bg-[#e6b02e] px-4 py-2 text-xs font-bold text-stone-950 transition shadow-sm"
                href="/all-products"
              >
                <span>Shop collection</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;

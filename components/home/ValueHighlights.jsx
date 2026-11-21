import SectionHeading from "@/components/layout/SectionHeading";

const guaranteeRows = [
  { label: "Official warranty", value: "2 Years Comprehensive" },
  { label: "Return window", value: "30-Day Money-Back Guarantee" },
  { label: "Product condition", value: "100% Brand New & Genuine" },
  { label: "Quality inspection", value: "Factory Sealed & Tested" },
  { label: "Payment security", value: "256-Bit Encrypted Checkout" },
  { label: "Support hotline", value: "24/7 Customer Care Desk" },
];

const shippingRows = [
  { label: "Order fulfillment", value: "Same-Day Priority Dispatch" },
  { label: "Free delivery", value: "On All Orders Over $50" },
  { label: "Shipment tracking", value: "Real-Time GPS Notifications" },
  { label: "Delivery partners", value: "FedEx, UPS & DHL Express" },
  { label: "Packaging", value: "Tamper-Evident Safety Box" },
  { label: "Easy exchange", value: "Free Doorstep Pickup" },
];

const quickLinks = [
  { title: "Browse complete catalog", detail: "Explore 200+ top electronics", href: "/all-products" },
  { title: "Track my order", detail: "Real-time delivery progress", href: "/my-orders" },
  { title: "View shopping cart", detail: "Check saved items & pricing", href: "/cart" },
  { title: "Customer support", detail: "Contact help center & FAQ", href: "/#contact" },
];

const ValueHighlights = () => (
  <section className="py-12">
    <SectionHeading
      eyebrow="QUICKCART ADVANTAGE"
      title="Why shop with us"
      badge="VERIFIED STORE"
      description="Transparent pricing, guaranteed genuine hardware, and fast insured delivery."
    />
    <div className="mx-auto mt-6 grid w-full max-w-[1440px] gap-5 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3 xl:px-12">
      {/* Bento Card 1: Guarantee & Protection */}
      <article className="rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#eceae3]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#f8f7f2] text-stone-700">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-stone-900">Guarantee & protection</h3>
        </div>
        <div className="divide-y divide-[#f2f0e8] pt-2">
          {guaranteeRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-stone-500 font-medium">{row.label}</span>
              <span className="text-stone-900 font-bold">{row.value}</span>
            </div>
          ))}
        </div>
      </article>

      {/* Bento Card 2: Fast Shipping */}
      <article className="rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#eceae3]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#f8f7f2] text-stone-700">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-stone-900">Shipping & logistics</h3>
        </div>
        <div className="divide-y divide-[#f2f0e8] pt-2">
          {shippingRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-stone-500 font-medium">{row.label}</span>
              <span className="text-stone-900 font-bold">{row.value}</span>
            </div>
          ))}
        </div>
      </article>

      {/* Bento Card 3: Quick Links */}
      <article className="rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-2xs md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#eceae3]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#f8f7f2] text-stone-700">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-stone-900">Quick links</h3>
        </div>
        <div className="divide-y divide-[#f2f0e8] pt-2">
          {quickLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="group flex items-center justify-between py-3 hover:bg-stone-50 rounded-xl px-2 transition"
            >
              <div>
                <p className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition">
                  {link.title}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">{link.detail}</p>
              </div>
              <span className="text-stone-400 group-hover:text-stone-800 transition">›</span>
            </a>
          ))}
        </div>
      </article>
    </div>
  </section>
);

export default ValueHighlights;

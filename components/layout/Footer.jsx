import Link from "next/link";
import LayoutContainer from "./LayoutContainer";
import BrandLogo from "@/components/common/BrandLogo";

const companyLinks = [
  { label: "Shop All Products", href: "/all-products" },
  { label: "Special Offers", href: "/all-products?category=Laptop,Console" },
  { label: "About QuickCart", href: "/#about" },
];

const supportLinks = [
  { label: "Shopping Cart", href: "/cart" },
  { label: "My Orders & Tracking", href: "/my-orders" },
  { label: "Help & Support", href: "/#contact" },
];

const Footer = () => (
  <footer id="about" className="mt-16 border-t border-border-subtle bg-dark-surface pb-10 pt-14 text-stone-400">
    <LayoutContainer size="wide">
      <div id="contact" className="grid gap-10 border-b border-stone-800 pb-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="max-w-sm space-y-4">
          <BrandLogo variant="dark" />
          <p className="text-xs leading-6 text-stone-400">
            A modern commerce platform offering curated electronics, transparent pricing, guaranteed authenticity, and express delivery.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link className="text-xs text-stone-400 transition hover:text-[#f5c344]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Customer Care</h3>
          <ul className="mt-4 space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link className="text-xs text-stone-400 transition hover:text-[#f5c344]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Get In Touch</h3>
          <p className="mt-4 text-xs text-stone-300">Dedicated customer support available 24/7</p>
          <a className="mt-2 block text-xs text-stone-400 transition hover:text-[#f5c344]" href="tel:+18005550199">
            +91 1234567890
          </a>
          <a className="mt-1 block text-xs text-stone-400 transition hover:text-[#f5c344]" href="mailto:support@quickcart.com">
            support@quickcart.com
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 pt-6 text-[11px] text-stone-500 sm:flex-row">
        <p>© {new Date().getFullYear()} QuickCart Inc. All rights reserved.</p>
        <Link
          className="inline-flex items-center gap-2.5 text-sm font-medium text-stone-300 transition hover:text-white"
          href="/status"
        >
          <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Website status
        </Link>
      </div>
    </LayoutContainer>
  </footer>
);

export default Footer;

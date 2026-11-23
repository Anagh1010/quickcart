"use client";

import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import { useAppContext } from "@/context/AppContext";

const MobileMenu = ({ isOpen, onClose }) => {
  const { isSeller, isAdmin } = useAppContext();
  if (!isOpen) return null;

  const goHome = () => {
    onClose();
    window.history.replaceState(null, "", "/");
    window.scrollTo(0, 0);
  };

  const links = [
    { action: goHome, href: "/", label: "Home" },
    { href: "/all-products", label: "Shop" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact & Support" },
    ...(isSeller ? [{ href: "/seller", label: "Seller Dashboard" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin Console" }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button aria-label="Close menu" className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <nav className="absolute right-4 top-20 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#e6e4dc] bg-[#fbf9f4] p-5 shadow-xl">
        <div className="mb-4 pb-3 border-b border-[#e6e4dc] flex items-center justify-between">
          <BrandLogo size="sm" onClick={goHome} />
          <button onClick={onClose} className="rounded-lg p-1 text-stone-500 hover:bg-stone-200/60">
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="space-y-1">
          {links.map(({ action, href, label }) => (
            <li key={href}>
              <Link
                className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-[#f5c344]/20 hover:text-stone-950 transition"
                href={href}
                onClick={action ?? onClose}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
